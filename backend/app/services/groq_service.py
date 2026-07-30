import json
import os
from pathlib import Path
from typing import Any, Dict, Iterable

from dotenv import load_dotenv
from groq import Groq

# Load backend/.env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)

from app.prompts import SYSTEM_GUARDRAILS

class GroqService:
    def __init__(self, model_name: str = "llama-3.1-8b-instant") -> None:
        print("SERVICE:", os.getenv("GROQ_API_KEY"))
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set. Please add it to environment.")

        self.client = Groq(api_key=api_key)
        self.model_name = model_name

    def complete_json(
        self,
        user_prompt: str,
        required_keys: Iterable[str],
        temperature: float = 0.1,
    ) -> Dict[str, Any]:
        response = self.client.chat.completions.create(
            model=self.model_name,
            temperature=temperature,
            messages=[
                {"role": "system", "content": SYSTEM_GUARDRAILS},
                {"role": "user", "content": user_prompt},
            ],
        )

        raw_content = response.choices[0].message.content if response.choices else ""
        parsed = self._safe_parse_json(raw_content)
        return self._normalize_result(parsed, required_keys)

    def _safe_parse_json(self, text: str) -> Dict[str, Any]:
        if not text:
            return {}

        cleaned = text.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1 and end > start:
                snippet = cleaned[start : end + 1]
                try:
                    return json.loads(snippet)
                except json.JSONDecodeError:
                    return {}
            return {}

    def _normalize_result(
        self, parsed: Dict[str, Any], required_keys: Iterable[str]
    ) -> Dict[str, Any]:
        normalized: Dict[str, Any] = {}
        for key in required_keys:
            value = parsed.get(key, "")
            if value is None:
                value = ""
            if not isinstance(value, str):
                value = str(value)
            normalized[key] = value.strip()
        return normalized
