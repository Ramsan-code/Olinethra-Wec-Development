"""
Olinethra ML Lead Scoring Configuration & Threshold Constants.
"""

import os
from pathlib import Path

# Base paths
ML_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = ML_DIR / "artifacts"
DATA_DIR = ML_DIR / "data"

# Create directories if they do not exist
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Data Readiness Thresholds (Section 3 of Prompt)
MIN_LABELED_LEADS = int(os.getenv("ML_MIN_TRAINING_SAMPLES", "100"))
MIN_POSITIVE_EXPLICIT = int(os.getenv("ML_MIN_POSITIVE_SAMPLES", "25"))
MIN_NEGATIVE_EXPLICIT = int(os.getenv("ML_MIN_NEGATIVE_SAMPLES", "25"))

# Score Band Thresholds (Section 19 of Prompt)
SCORE_LOW_THRESHOLD = float(os.getenv("ML_SCORE_LOW_THRESHOLD", "40.0"))    # 0-39% = LOW
SCORE_HIGH_THRESHOLD = float(os.getenv("ML_SCORE_HIGH_THRESHOLD", "70.0"))  # 70-100% = HIGH

# Model Versioning
MODEL_VERSION = "lead-conversion-v1"
