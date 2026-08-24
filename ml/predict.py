"""
Olinethra ML Lead Score Inference Module.

Can be run directly via CLI or invoked by Node.js service via child_process.
Handles both ACTIVE ML inference and COLLECTING_DATA deterministic fallback.
"""

import sys
import json
import pandas as pd
import joblib
from pathlib import Path

from config import ARTIFACTS_DIR, MODEL_VERSION, SCORE_LOW_THRESHOLD, SCORE_HIGH_THRESHOLD
from features import extract_lead_features, calculate_requirements_completeness


def get_signals(features: dict, completeness: float):
    positive = []
    negative = []
    uncertain = []

    if features.get("hasBudget"):
        positive.append("Clear budget specified")
    else:
        uncertain.append("Budget not specified")

    if features.get("hasTimeline"):
        positive.append("Target timeline specified")
    else:
        uncertain.append("Timeline flexible/unspecified")

    if features.get("hasProjectSummary"):
        positive.append("Detailed project requirements provided")
    else:
        uncertain.append("Short or brief project description")

    if features.get("numberOfRequestedFeatures", 0) > 0:
        positive.append(f"{features['numberOfRequestedFeatures']} key feature(s) requested")

    if features.get("hasCompany"):
        positive.append("Client company name provided")
    else:
        uncertain.append("Company name unlisted")

    if completeness >= 0.70:
        positive.append(f"High requirement completeness score ({int(completeness * 100)}%)")

    return {
        "positiveSignals": positive,
        "negativeSignals": negative,
        "uncertainSignals": uncertain,
    }


def predict_lead_score(lead_data: dict) -> dict:
    meta_path = ARTIFACTS_DIR / "metadata.json"
    model_path = ARTIFACTS_DIR / "model.joblib"

    completeness = calculate_requirements_completeness(lead_data)
    completeness_percent = round(completeness * 100.0, 1)

    features = extract_lead_features(lead_data)
    signals = get_signals(features, completeness)

    # Check if trained active model exists
    is_active = False
    model_version = MODEL_VERSION
    algorithm = "Fallback Heuristic"

    if meta_path.exists() and model_path.exists():
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
            if meta.get("status") == "ACTIVE":
                is_active = True
                model_version = meta.get("modelVersion", MODEL_VERSION)
                algorithm = meta.get("algorithm", "scikit-learn")
        except Exception:
            is_active = False

    if is_active:
        try:
            pipeline = joblib.load(model_path)
            df = pd.DataFrame([features])
            proba = pipeline.predict_proba(df)[0, 1]
            prob_percent = round(float(proba) * 100.0, 1)

            if prob_percent >= SCORE_HIGH_THRESHOLD:
                band = "HIGH"
            elif prob_percent >= SCORE_LOW_THRESHOLD:
                band = "MEDIUM"
            else:
                band = "LOW"

            return {
                "status": "ACTIVE",
                "conversionProbability": prob_percent,
                "completenessScore": completeness_percent,
                "scoreBand": band,
                "priority": band,
                "modelVersion": model_version,
                "algorithm": algorithm,
                "confidence": "Medium",
                "explanation": signals,
                "isDataCollection": False,
                "notice": None,
            }
        except Exception as e:
            # Fallback if inference fails
            print(f"[ML PREDICT WARNING] Model inference failed, switching to DATA COLLECTION fallback: {e}", file=sys.stderr)

    # DATA COLLECTION Fallback Mode (No fabricated ML score)
    if completeness_percent >= 70.0:
        fallback_band = "HIGH"
    elif completeness_percent >= 40.0:
        fallback_band = "MEDIUM"
    else:
        fallback_band = "LOW"

    return {
        "status": "COLLECTING_DATA",
        "conversionProbability": None,
        "completenessScore": completeness_percent,
        "scoreBand": fallback_band,
        "priority": fallback_band,
        "modelVersion": model_version,
        "algorithm": "Completeness Evaluator",
        "confidence": "Low",
        "explanation": signals,
        "isDataCollection": True,
        "notice": "Lead prediction is not available yet. Olinethra is collecting historical lead outcomes before enabling machine-learning predictions.",
    }


def main():
    if len(sys.argv) > 1:
        raw_input = sys.argv[1]
    else:
        raw_input = sys.stdin.read()

    try:
        lead_data = json.loads(raw_input)
    except Exception as err:
        print(json.dumps({"error": f"Invalid JSON input: {err}"}))
        sys.exit(1)

    result = predict_lead_score(lead_data)
    print(json.dumps(result, indent=2))
    sys.exit(0)


if __name__ == "__main__":
    main()
