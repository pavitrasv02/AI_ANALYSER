from pydantic import BaseModel, Field


class ComplaintTextRequest(BaseModel):
    complaint_text: str = Field(
        ...,
        min_length=5,
        description="Plain complaint text submitted from frontend AI Copilot.",
    )


class ComplaintStructuredData(BaseModel):
    customer_name: str = ""
    product_name: str = ""
    batch_number: str = ""
    manufacturing_site: str = ""
    complaint_date: str = ""
    complaint_category: str = ""
    complaint_description: str = ""
    severity: str = ""
    risk_level: str = ""
    status: str = "Draft"
    summary: str = ""
    root_cause: str = ""
    capa_recommendation: str = ""
