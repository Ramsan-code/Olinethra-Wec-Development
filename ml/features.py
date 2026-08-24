"""
Olinethra ML Lead Feature Engineering & Extraction Module.

Strict Rules:
1. EXCLUDE sensitive characteristics (race, gender, religion, etc.).
2. EXCLUDE raw PII identifiers (phone number, email address, name).
3. EXCLUDE data leakage features known only post-outcome (wonDate, finalContractValue, lostReason, invoiceCreated).
"""

import re
from typing import Dict, Any, List

ALLOWED_SOURCES = {"WHATSAPP", "WEBSITE", "DIRECT", "OTHER"}
ALLOWED_PROJECT_TYPES = {
    "WEBSITE",
    "WEB_APP",
    "ECOMMERCE",
    "UI_UX",
    "BACKEND_API",
    "MAINTENANCE",
    "CUSTOM_SOFTWARE",
    "OTHER",
}
ALLOWED_BUDGET_RANGES = {"UNKNOWN", "LOW", "MEDIUM", "HIGH", "ENTERPRISE"}
ALLOWED_TIMELINES = {"URGENT", "1_MONTH", "1_TO_3_MONTHS", "3_TO_6_MONTHS", "6_PLUS_MONTHS", "UNKNOWN"}

# Forbidden leakage keys
LEAKAGE_KEYS = {
    "wonDate",
    "lostReason",
    "finalContractValue",
    "invoiceCreated",
    "projectCreated",
    "finalProposalAccepted",
    "paymentDetails",
}


def normalize_project_type(raw_type: str) -> str:
    if not raw_type:
        return "OTHER"
    raw_lower = raw_type.lower()
    if "e-commerce" in raw_lower or "shop" in raw_lower or "store" in raw_lower:
        return "ECOMMERCE"
    if "corporate" in raw_lower or "landing" in raw_lower or "website" in raw_lower:
        return "WEBSITE"
    if "mobile" in raw_lower or "app" in raw_lower or "saas" in raw_lower:
        return "WEB_APP"
    if "ui" in raw_lower or "ux" in raw_lower or "design" in raw_lower:
        return "UI_UX"
    if "api" in raw_lower or "backend" in raw_lower:
        return "BACKEND_API"
    if "maintenance" in raw_lower or "support" in raw_lower:
        return "MAINTENANCE"
    if "custom" in raw_lower or "portal" in raw_lower or "software" in raw_lower:
        return "CUSTOM_SOFTWARE"
    return "OTHER"


def normalize_budget(raw_budget: str) -> str:
    if not raw_budget or raw_budget.strip().lower() in ["not specified", "n/a", "unknown", ""]:
        return "UNKNOWN"
    b_lower = raw_budget.lower()
    if any(k in b_lower for k in ["< $1k", "< 1k", "small", "low", "1,000"]):
        return "LOW"
    if any(k in b_lower for k in ["1k-5k", "medium", "standard", "5,000", "10,000"]):
        return "MEDIUM"
    if any(k in b_lower for k in ["5k-20k", "high", "large", "20,000"]):
        return "HIGH"
    if any(k in b_lower for k in ["enterprise", "20k+", "50k", "100k"]):
        return "ENTERPRISE"
    return "MEDIUM"


def normalize_timeline(raw_timeline: str) -> str:
    if not raw_timeline or raw_timeline.strip().lower() in ["not specified", "n/a", "unknown", ""]:
        return "UNKNOWN"
    t_lower = raw_timeline.lower()
    if "urgent" in t_lower or "asap" in t_lower or "1 week" in t_lower or "2 weeks" in t_lower:
        return "URGENT"
    if "1 month" in t_lower:
        return "1_MONTH"
    if "2-3" in t_lower or "1-3" in t_lower or "3 months" in t_lower or "2 months" in t_lower:
        return "1_TO_3_MONTHS"
    if "3-6" in t_lower or "6 months" in t_lower:
        return "3_TO_6_MONTHS"
    if "6+" in t_lower or "year" in t_lower:
        return "6_PLUS_MONTHS"
    return "UNKNOWN"


def calculate_requirements_completeness(lead: Dict[str, Any]) -> float:
    score = 0.0

    # Project Type present
    p_type = lead.get("projectType")
    if p_type and str(p_type).strip().lower() not in ["not specified", "other", ""]:
        score += 0.15

    # Project Summary detailed
    summary = str(lead.get("projectSummary") or lead.get("message") or "")
    if len(summary.strip()) >= 15:
        score += 0.25
    elif len(summary.strip()) > 0:
        score += 0.10

    # Features listed
    features = lead.get("features") or []
    if isinstance(features, list) and len(features) > 0:
        score += 0.20

    # Budget specified
    budget = str(lead.get("budget") or "")
    if budget.strip() and budget.strip().lower() not in ["not specified", "n/a", "unknown"]:
        score += 0.15

    # Timeline specified
    timeline = str(lead.get("timeline") or "")
    if timeline.strip() and timeline.strip().lower() not in ["not specified", "n/a", "unknown"]:
        score += 0.15

    # Contact Info (email or phone present)
    email = str(lead.get("email") or "").strip()
    phone = str(lead.get("phone") or "").strip()
    if email or phone:
        score += 0.10

    return min(1.0, round(score, 2))


def extract_lead_features(lead: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitizes raw lead document and produces pure ML feature dictionary.
    Excludes PII and post-outcome leakage variables.
    """
    # Guard against data leakage
    for key in LEAKAGE_KEYS:
        if key in lead:
            # Drop post-outcome leakage key silently
            pass

    phone = str(lead.get("phone") or "").strip()
    email = str(lead.get("email") or "").strip()
    company = str(lead.get("company") or "").strip()
    summary = str(lead.get("projectSummary") or lead.get("message") or "").strip()
    features_list = lead.get("features") if isinstance(lead.get("features"), list) else []

    source = str(lead.get("source") or "WHATSAPP").upper()
    if source not in ALLOWED_SOURCES:
        source = "OTHER"

    p_type = normalize_project_type(str(lead.get("projectType") or ""))
    budget_range = normalize_budget(str(lead.get("budget") or ""))
    timeline_cat = normalize_timeline(str(lead.get("timeline") or ""))
    completeness = calculate_requirements_completeness(lead)

    status = str(lead.get("status") or "").upper()
    notes = str(lead.get("notes") or "").lower()
    human_handoff = 1 if (status == "HUMAN_HANDOFF" or "handoff" in notes or "human" in notes) else 0

    return {
        "hasPhone": 1 if len(phone) > 3 else 0,
        "hasEmail": 1 if "@" in email else 0,
        "hasCompany": 1 if (company and company.lower() not in ["n/a", "none", ""]) else 0,
        "hasProjectSummary": 1 if len(summary) >= 15 else 0,
        "hasBudget": 1 if budget_range != "UNKNOWN" else 0,
        "hasTimeline": 1 if timeline_cat != "UNKNOWN" else 0,
        "numberOfRequestedFeatures": len(features_list),
        "requirementsCompleteness": completeness,
        "leadSource": source,
        "projectType": p_type,
        "budgetRange": budget_range,
        "timeline": timeline_cat,
        "humanHandoffOccurred": human_handoff,
    }
