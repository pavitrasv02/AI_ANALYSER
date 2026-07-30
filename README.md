#  AI-Powered Pharmaceutical Complaint Management System

An intelligent complaint management system that leverages Large Language Models (LLMs) to automate pharmaceutical complaint processing. The application extracts structured complaint information from unstructured customer complaints, generates AI-powered quality insights, and assists Quality Assurance (QA) teams in faster investigation and decision-making.

---

##  Overview

Pharmaceutical manufacturers receive complaints in various formats such as emails, PDFs, and free-text descriptions. Manually reviewing these complaints is time-consuming and prone to inconsistencies.

This application uses AI to automatically:

- Extract complaint information
- Populate structured complaint forms
- Assess complaint risk
- Generate complaint summaries
- Recommend possible root causes
- Suggest CAPA (Corrective and Preventive Actions)
- Allow users to refine complaint details using natural language

---

# ✨ Features

##  AI Complaint Analysis

Convert unstructured complaint descriptions into structured pharmaceutical complaint records.

Automatically extracts:

- Customer Name
- Product Name
- Batch Number
- Manufacturing Site
- Complaint Category
- Severity
- Risk Level
- Complaint Description

---

##  Document Extraction

Upload pharmaceutical complaint documents such as:

- PDF
- DOCX
- TXT

The system extracts complaint information from the uploaded document and automatically populates the complaint form using AI.

---

## Natural Language Complaint Editing

After AI extraction, users can continue interacting with the AI using natural language.

Example:

> "The batch number should be CHG260712A and the affected quantity is 50 kg."

The AI updates only the relevant complaint fields while preserving the remaining information.

---

##  AI Copilot

The AI Copilot assists Quality Assurance teams by generating:

- Complaint Summary
- AI Risk Classification
- Root Cause Hypothesis
- CAPA Recommendations

---

##  Complaint Completeness Checker

Displays:

- Complaint completion percentage
- Missing mandatory fields
- Quality review readiness

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite

## Backend

- FastAPI
- Python

## AI & LLM

- LangGraph
- Groq API
- Llama 3.1

## Document Processing

- PyPDF
- python-docx

---

#  System Architecture

```
                Complaint Text / PDF
                         │
                         ▼
                Document Extraction
                         │
                         ▼
                  LangGraph Workflow
                         │
                         ▼
                Groq LLM (Llama 3.1)
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
 Complaint Form Auto-fill        AI Copilot Insights
          │
          ▼
 Natural Language Updates
```

---

# AI Workflow

1. User enters complaint text or uploads a complaint document.
2. Backend extracts document text (if applicable).
3. LangGraph processes the complaint.
4. Groq LLM extracts structured complaint information.
5. Complaint form is automatically populated.
6. AI generates:
   - Summary
   - Risk Assessment
   - Root Cause
   - CAPA Recommendations
7. User can continue modifying the complaint using natural language.

---

# 📂 Project Structure

```
aivoa-complaint-system/

├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── services/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── workflows/
│   │   └── models/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd aivoa-complaint-system
```

---

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

#  Sample Workflow

1. Upload a complaint PDF or enter complaint text.
2. AI extracts complaint details.
3. Complaint form is automatically populated.
4. AI Copilot generates:
   - Summary
   - Risk Assessment
   - Root Cause
   - CAPA Recommendation
5. Continue refining the complaint using natural language.

---

#  Future Improvements

- Duplicate Complaint Detection
- Multi-document complaint analysis
- OCR support for scanned complaint documents
- PostgreSQL persistence
- Audit trail and complaint history
- User authentication and role-based access

---

#  Author

**Pavitra S V**

B.E. Computer Science & Engineering

National Institute of Engineering, Mysuru

---

# 📄 License

This project was developed as part of an AI Internship Technical Assignment for educational and evaluation purposes.