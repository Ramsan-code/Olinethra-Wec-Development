"""
Olinethra Sanitized Lead Dataset Exporter.

Reads raw leads from MongoDB or JSON file, sanitizes PII and leakage fields,
and exports ml/data/leads.json for model training and readiness evaluation.
"""

import sys
import json
import os
from pathlib import Path
from config import DATA_DIR
from features import extract_lead_features


def export_leads_from_list(raw_leads: list, output_file: Path = None):
    if output_file is None:
        output_file = DATA_DIR / "leads.json"

    sanitized = []
    for lead in raw_leads:
        # Preserve legacyId, status, createdAt for dataset analysis
        item = {
            "id": lead.get("legacyId") or str(lead.get("_id") or ""),
            "status": str(lead.get("status") or "NEW").upper(),
            "createdAt": str(lead.get("createdAt") or ""),
            "source": lead.get("source"),
            "projectType": lead.get("projectType"),
            "projectSummary": lead.get("projectSummary") or lead.get("message"),
            "budget": lead.get("budget"),
            "timeline": lead.get("timeline"),
            "features": lead.get("features") if isinstance(lead.get("features"), list) else [],
            "notes": lead.get("notes"),

            # Boolean presence attributes ONLY (No raw PII)
            "hasPhone": bool(lead.get("phone")),
            "hasEmail": bool(lead.get("email")),
            "hasCompany": bool(lead.get("company") and str(lead.get("company")).lower() not in ["n/a", "none", ""]),
        }

        # Guard against leakage attributes
        for leakage_key in ["wonDate", "finalContractValue", "lostReason", "invoiceCreated"]:
            if leakage_key in item:
                del item[leakage_key]

        sanitized.append(item)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(sanitized, f, indent=2)

    print(f"[ML EXPORT] Exported {len(sanitized)} sanitized leads to {output_file}")
    return len(sanitized)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].endswith(".json"):
        input_path = Path(sys.argv[1])
        if input_path.exists():
            with open(input_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            export_leads_from_list(raw)
            sys.exit(0)
    print("[ML EXPORT] Usage: python ml/export_leads.py <path_to_raw_leads.json>")
    sys.exit(1)
