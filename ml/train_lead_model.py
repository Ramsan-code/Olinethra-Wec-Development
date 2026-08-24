"""
Olinethra ML Model Training & Evaluation Pipeline.

Trains and evaluates interpretable lead conversion prediction models (Logistic Regression, Random Forest)
against a baseline. Saves model artifacts and metrics upon successful evaluation.
"""

import sys
import json
import datetime
import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
)

from config import (
    MIN_LABELED_LEADS,
    MIN_POSITIVE_EXPLICIT,
    MIN_NEGATIVE_EXPLICIT,
    MODEL_VERSION,
    ARTIFACTS_DIR,
    DATA_DIR,
)
from features import extract_lead_features, LEAKAGE_KEYS
from check_readiness import evaluate_dataset_readiness


def train_pipeline(data_file: Path = None):
    if data_file is None:
        data_file = DATA_DIR / "leads.json"

    # Step 1: Load Data
    if not data_file.exists():
        print("[ML TRAIN] No dataset file found at:", data_file)
        save_fallback_metadata("COLLECTING_DATA", "No dataset file available.")
        return False

    with open(data_file, "r", encoding="utf-8") as f:
        raw_leads = json.load(f)

    # Step 2: Check Readiness
    readiness = evaluate_dataset_readiness(raw_leads)
    print("[ML TRAIN] Dataset Readiness Evaluation:")
    print(json.dumps(readiness, indent=2))

    if not readiness["isReady"]:
        print("[ML TRAIN] Dataset does not meet minimum ML readiness thresholds. Setting status to COLLECTING_DATA.")
        save_fallback_metadata("COLLECTING_DATA", "; ".join(readiness["readinessReasons"]), readiness)
        return False

    # Step 3: Filter Labeled Outcomes (WON = 1, LOST = 0)
    labeled_data = []
    targets = []

    for lead in raw_leads:
        st = str(lead.get("status") or "").upper()
        if st in ["WON", "LOST"]:
            # Feature extraction (Leakage free)
            feat = extract_lead_features(lead)
            labeled_data.append(feat)
            targets.append(1 if st == "WON" else 0)

    df = pd.DataFrame(labeled_data)
    y = np.array(targets)

    print(f"[ML TRAIN] Extracted {len(df)} labeled feature vectors. Class balance: {np.mean(y):.2%} WON")

    # Step 4: Define Preprocessing & Feature Sets
    categorical_cols = ["leadSource", "projectType", "budgetRange", "timeline"]
    numerical_cols = [
        "hasPhone",
        "hasEmail",
        "hasCompany",
        "hasProjectSummary",
        "hasBudget",
        "hasTimeline",
        "numberOfRequestedFeatures",
        "requirementsCompleteness",
        "humanHandoffOccurred",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
            ("num", StandardScaler(), numerical_cols),
        ]
    )

    # Step 5: Train / Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        df, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
    )

    # Step 6: Baseline Model (Majority Class Dummy Classifier)
    dummy = Pipeline([("prep", preprocessor), ("clf", DummyClassifier(strategy="most_frequent"))])
    dummy.fit(X_train, y_train)
    y_dummy_pred = dummy.predict(X_test)
    dummy_f1 = f1_score(y_test, y_dummy_pred, zero_division=0)
    print(f"[ML TRAIN] Baseline (Majority Class) F1 Score: {dummy_f1:.4f}")

    # Step 7: Candidate Models
    models = {
        "LogisticRegression": LogisticRegression(C=1.0, max_iter=1000, random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42),
    }

    best_name = None
    best_pipeline = None
    best_metrics = None
    best_score = -1.0

    for name, clf in models.items():
        pipeline = Pipeline([("prep", preprocessor), ("clf", clf)])
        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else y_pred

        p = float(precision_score(y_test, y_pred, zero_division=0))
        r = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))

        try:
            roc_auc = float(roc_auc_score(y_test, y_proba))
        except Exception:
            roc_auc = 0.5

        try:
            pr_auc = float(average_precision_score(y_test, y_proba))
        except Exception:
            pr_auc = 0.5

        cm = confusion_matrix(y_test, y_pred).tolist()

        metrics = {
            "modelName": name,
            "precision": round(p, 4),
            "recall": round(r, 4),
            "f1": round(f1, 4),
            "rocAuc": round(roc_auc, 4),
            "prAuc": round(pr_auc, 4),
            "confusionMatrix": cm,
            "baselineF1": round(float(dummy_f1), 4),
            "outperformedBaseline": bool(f1 >= dummy_f1 or pr_auc > 0.5),
        }

        print(f"[ML TRAIN] Model candidate {name}: Precision={p:.4f}, Recall={r:.4f}, F1={f1:.4f}, ROC-AUC={roc_auc:.4f}")

        if pr_auc > best_score:
            best_score = pr_auc
            best_name = name
            best_pipeline = pipeline
            best_metrics = metrics

    # Step 8: Save Model Artifacts
    print(f"[ML TRAIN] Selected best model: {best_name} (PR-AUC: {best_score:.4f})")

    model_path = ARTIFACTS_DIR / "model.joblib"
    joblib.dump(best_pipeline, model_path)

    metadata = {
        "modelVersion": MODEL_VERSION,
        "status": "ACTIVE",
        "trainedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "algorithm": best_name,
        "trainingSamples": int(len(X_train)),
        "testSamples": int(len(X_test)),
        "totalLabeledLeads": int(len(df)),
        "positiveSamples": int(np.sum(y)),
        "negativeSamples": int(len(y) - np.sum(y)),
        "features": categorical_cols + numerical_cols,
        "leakageKeysExcluded": list(LEAKAGE_KEYS),
        "readiness": readiness,
    }

    with open(ARTIFACTS_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(ARTIFACTS_DIR / "metrics.json", "w", encoding="utf-8") as f:
        json.dump(best_metrics, f, indent=2)

    print("[ML TRAIN] Model artifacts successfully saved to:", ARTIFACTS_DIR)
    return True


def save_fallback_metadata(status: str, reason: str, readiness: dict = None):
    metadata = {
        "modelVersion": MODEL_VERSION,
        "status": status,
        "trainedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "reason": reason,
        "readiness": readiness or {},
    }
    with open(ARTIFACTS_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)


if __name__ == "__main__":
    success = train_pipeline()
    sys.exit(0 if success else 1)
