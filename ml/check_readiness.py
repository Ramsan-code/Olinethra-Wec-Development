"""
Olinethra ML Lead Dataset Readiness Evaluator.
"""

import sys
import json
from pathlib import Path
from typing import Dict, Any, List

from config import (
    MIN_LABELED_LEADS,
    MIN_POSITIVE_EXPLICIT,
    MIN_NEGATIVE_EXPLICIT,
    DATA_DIR,
    ARTIFACTS_DIR,
)


def evaluate_dataset_readiness(leads: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_leads = len(leads)
    won_leads = 0
    lost_leads = 0
    unresolved_leads = 0

    for lead in leads:
        st = str(lead.get("status") or "").upper()
        if st == "WON":
            won_leads += 1
        elif st == "LOST":
            lost_leads += 1
        else:
            unresolved_leads += 1

    total_labeled = won_leads + lost_leads

    # Check thresholds
    meets_total = total_labeled >= MIN_LABELED_LEADS
    meets_positive = won_leads >= MIN_POSITIVE_EXPLICIT
    meets_negative = lost_leads >= MIN_NEGATIVE_EXPLICIT

    is_ready = meets_total and meets_positive and meets_negative

    status_code = "READY" if is_ready else "COLLECTING_DATA"

    reasons = []
    if not meets_total:
        reasons.append(f"Labeled resolved leads ({total_labeled}) below threshold ({MIN_LABELED_LEADS}).")
    if not meets_positive:
        reasons.append(f"WON leads ({won_leads}) below minimum requirement ({MIN_POSITIVE_EXPLICIT}).")
    if not meets_negative:
        reasons.append(f"LOST leads ({lost_leads}) below minimum requirement ({MIN_NEGATIVE_EXPLICIT}).")

    result = {
        "status": status_code,
        "isReady": is_ready,
        "totalLeads": total_leads,
        "totalLabeled": total_labeled,
        "wonCount": won_leads,
        "lostCount": lost_leads,
        "unresolvedCount": unresolved_leads,
        "thresholds": {
            "minLabeledLeads": MIN_LABELED_LEADS,
            "minPositiveSamples": MIN_POSITIVE_EXPLICIT,
            "minNegativeSamples": MIN_NEGATIVE_EXPLICIT,
        },
        "readinessReasons": reasons,
    }

    return result


def main():
    dataset_file = DATA_DIR / "leads.json"
    if not dataset_file.exists():
        # Fallback summary when no dataset file is found
        result = evaluate_dataset_readiness([])
        print(json.dumps(result, indent=2))
        sys.exit(1)

    with open(dataset_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    result = evaluate_dataset_readiness(data)
    print(json.dumps(result, indent=2))

    if not result["isReady"]:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
