from typing import Dict, TypedDict

from langgraph.graph import END, StateGraph

from app.prompts import (
    CAPA_RECOMMENDATION_PROMPT,
    EXTRACT_COMPLAINT_PROMPT,
    GENERATE_SUMMARY_PROMPT,
    RISK_CLASSIFICATION_PROMPT,
    ROOT_CAUSE_PROMPT,
)
from app.schemas.ai_models import ComplaintStructuredData
from app.services.groq_service import GroqService


class ComplaintGraphState(TypedDict):
    complaint_text: str
    data: Dict[str, str]


BASE_KEYS = [
    "customer_name",
    "product_name",
    "batch_number",
    "manufacturing_site",
    "complaint_date",
    "complaint_category",
    "complaint_description",
    "severity",
    "risk_level",
    "status",
]


class ComplaintLangGraphWorkflow:
    def __init__(self) -> None:
        self.groq = GroqService(model_name="llama-3.1-8b-instant")
        self.graph = self._build_graph()

    def _build_graph(self):
        workflow = StateGraph(ComplaintGraphState)

        workflow.add_node("extract_complaint", self._extract_complaint_node)
        workflow.add_node("generate_summary", self._generate_summary_node)
        workflow.add_node("risk_classification", self._risk_classification_node)
        workflow.add_node("root_cause_recommendation", self._root_cause_node)
        workflow.add_node("capa_recommendation", self._capa_node)

        workflow.set_entry_point("extract_complaint")
        workflow.add_edge("extract_complaint", "generate_summary")
        workflow.add_edge("generate_summary", "risk_classification")
        workflow.add_edge("risk_classification", "root_cause_recommendation")
        workflow.add_edge("root_cause_recommendation", "capa_recommendation")
        workflow.add_edge("capa_recommendation", END)

        return workflow.compile()

    def run(self, complaint_text: str) -> ComplaintStructuredData:
        initial_state: ComplaintGraphState = {
            "complaint_text": complaint_text,
            "data": ComplaintStructuredData().model_dump(),
        }
        final_state = self.graph.invoke(initial_state)
        return ComplaintStructuredData(**final_state["data"])

    def _extract_complaint_node(self, state: ComplaintGraphState) -> ComplaintGraphState:
        prompt = (
            f"{EXTRACT_COMPLAINT_PROMPT}\n\n"
            f"Complaint Text:\n{state['complaint_text']}"
        )
        extracted = self.groq.complete_json(prompt, BASE_KEYS)

        merged = {**state["data"], **extracted}
        if not merged.get("status"):
            merged["status"] = "Draft"
        return {"complaint_text": state["complaint_text"], "data": merged}

    def _generate_summary_node(self, state: ComplaintGraphState) -> ComplaintGraphState:
        prompt = (
            f"{GENERATE_SUMMARY_PROMPT}\n\n"
            f"Complaint Text:\n{state['complaint_text']}\n\n"
            f"Extracted Data:\n{state['data']}"
        )
        summary_data = self.groq.complete_json(prompt, ["summary"])
        merged = {**state["data"], **summary_data}
        return {"complaint_text": state["complaint_text"], "data": merged}

    def _risk_classification_node(
        self, state: ComplaintGraphState
    ) -> ComplaintGraphState:
        prompt = (
            f"{RISK_CLASSIFICATION_PROMPT}\n\n"
            f"Complaint Text:\n{state['complaint_text']}\n\n"
            f"Current Data:\n{state['data']}"
        )
        risk_data = self.groq.complete_json(prompt, ["severity", "risk_level"])
        merged = {**state["data"], **risk_data}
        return {"complaint_text": state["complaint_text"], "data": merged}

    def _root_cause_node(self, state: ComplaintGraphState) -> ComplaintGraphState:
        prompt = (
            f"{ROOT_CAUSE_PROMPT}\n\n"
            f"Complaint Text:\n{state['complaint_text']}\n\n"
            f"Current Data:\n{state['data']}"
        )
        root_cause_data = self.groq.complete_json(prompt, ["root_cause"])
        merged = {**state["data"], **root_cause_data}
        return {"complaint_text": state["complaint_text"], "data": merged}

    def _capa_node(self, state: ComplaintGraphState) -> ComplaintGraphState:
        prompt = (
            f"{CAPA_RECOMMENDATION_PROMPT}\n\n"
            f"Complaint Text:\n{state['complaint_text']}\n\n"
            f"Current Data:\n{state['data']}"
        )
        capa_data = self.groq.complete_json(prompt, ["capa_recommendation"])
        merged = {**state["data"], **capa_data}
        return {"complaint_text": state["complaint_text"], "data": merged}
