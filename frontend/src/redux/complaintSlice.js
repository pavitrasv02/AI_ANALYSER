import { createSlice } from '@reduxjs/toolkit'

const initialForm = {
  complaintId: 'CMP-2026-00124',
  customerName: 'Apex Medical Distributors',
  productName: 'Paracetamol 500 mg Tablets',
  batchNumber: 'BT-PA-240615',
  manufacturingSite: 'Hyderabad Manufacturing Unit',
  complaintDate: '2026-07-30',
  complaintCategory: 'Packaging Defect',
  complaintDescription:
    'Customer reported damaged blister pockets and partial foil separation observed during product receipt inspection.',
  severity: 'Major',
  riskLevel: 'Medium',
  status: 'Draft',
}

const initialInsights = {
  summary: '',
  rootCause: '',
  capaRecommendation: '',
}

const complaintSlice = createSlice({
  name: 'complaint',
  initialState: {
    form: initialForm,
    insights: initialInsights,
    aiUpdatedFields: ['severity', 'riskLevel'],
  },
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload
      state.form[field] = value
    },
    clearForm: (state) => {
      state.form = {
        ...initialForm,
        complaintId: state.form.complaintId,
        customerName: '',
        productName: '',
        batchNumber: '',
        manufacturingSite: '',
        complaintDate: '',
        complaintCategory: '',
        complaintDescription: '',
        severity: '',
        riskLevel: '',
        status: 'Draft',
      }
      state.insights = { ...initialInsights }
      state.aiUpdatedFields = []
    },
    setAiUpdatedFields: (state, action) => {
      state.aiUpdatedFields = action.payload
    },
    applyAIComplaintData: (state, action) => {
      const aiData = action.payload || {}
      const fieldMap = {
        customer_name: 'customerName',
        product_name: 'productName',
        batch_number: 'batchNumber',
        manufacturing_site: 'manufacturingSite',
        complaint_date: 'complaintDate',
        complaint_category: 'complaintCategory',
        complaint_description: 'complaintDescription',
        severity: 'severity',
        risk_level: 'riskLevel',
        status: 'status',
      }

      const updatedFields = []
      Object.entries(fieldMap).forEach(([apiKey, formKey]) => {
        const value = aiData[apiKey]
        if (typeof value === 'string' && value.trim() !== '') {
          state.form[formKey] = value.trim()
          updatedFields.push(formKey)
        }
      })

      state.insights = {
        summary: typeof aiData.summary === 'string' ? aiData.summary.trim() : '',
        rootCause:
          typeof aiData.root_cause === 'string' ? aiData.root_cause.trim() : '',
        capaRecommendation:
          typeof aiData.capa_recommendation === 'string'
            ? aiData.capa_recommendation.trim()
            : '',
      }

      state.aiUpdatedFields = updatedFields
    },
  },
})

export const { setField, clearForm, setAiUpdatedFields, applyAIComplaintData } =
  complaintSlice.actions
export default complaintSlice.reducer
