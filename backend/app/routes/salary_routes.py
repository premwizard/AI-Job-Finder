from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/salary", tags=["salary"])

class AnalyzeOfferRequest(BaseModel):
    offer_id: str

class BenchmarkRequest(BaseModel):
    role: str
    location: str
    experience_level: str

class CompareRequest(BaseModel):
    offer_ids: List[str]

class NegotiateRequest(BaseModel):
    offer_id: str
    focus_area: str

class SimulateRequest(BaseModel):
    offer_id: str
    scenario: Dict[str, Any]

@router.get("/offers")
def get_offers():
    return {"offers": [
        {
            "id": "off_1", "company": "Acme Corp", "role": "Senior Engineer",
            "base_salary": 160000, "equity": 50000, "bonus": 15000,
            "total_compensation": 225000, "status": "Active"
        },
        {
            "id": "off_2", "company": "Global Tech", "role": "Lead Engineer",
            "base_salary": 175000, "equity": 80000, "bonus": 20000,
            "total_compensation": 275000, "status": "Negotiating"
        }
    ]}

@router.get("/offer/{offer_id}")
def get_offer(offer_id: str):
    return {
        "id": offer_id,
        "company": "Global Tech",
        "role": "Lead Engineer",
        "base_salary": 175000,
        "equity": 80000,
        "bonus": 20000,
        "total_compensation": 275000,
        "benefits": ["Remote", "401k Match", "Unlimited PTO"],
        "status": "Negotiating"
    }

@router.post("/analyze")
def analyze_offer(req: AnalyzeOfferRequest):
    return {"analysis": "This offer is 15% above market average but lacks strong equity upside."}

@router.post("/benchmark")
def benchmark_salary(req: BenchmarkRequest):
    return {
        "range": "$150k - $210k",
        "percentile": 75,
        "market_position": "Strong"
    }

@router.post("/compare")
def compare_offers(req: CompareRequest):
    return {"recommendation": "Offer 2 has a higher 5-year ROI due to equity grants."}

@router.post("/negotiate")
def negotiate_offer(req: NegotiateRequest):
    return {
        "target": "$185,000",
        "minimum_acceptable": "$175,000",
        "draft_email": f"Hi team, I am very excited about the offer. Based on market rates for {req.focus_area}..."
    }

@router.post("/simulate")
def simulate_decision(req: SimulateRequest):
    return {"simulated_roi": "$1.4M over 5 years"}

@router.get("/statistics")
def get_statistics():
    return {
        "offers_analyzed": 5,
        "negotiations_generated": 3,
        "average_comp_increase": "+$15,000",
        "negotiation_success_rate": "80%",
        "market_trends": "Salaries for AI Engineers are up 8% YoY"
    }
