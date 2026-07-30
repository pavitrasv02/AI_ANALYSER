export const api = {
  health: async () => ({
    ok: true,
    message: 'Frontend service active.',
  }),

  analyzeComplaint: async (complaintText) => {
    const response = await fetch('/api/ai/analyze-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complaint_text: complaintText,
      }),
    })

    if (!response.ok) {
      let detail = 'Failed to analyze complaint text.'
      try {
        const payload = await response.json()
        if (payload?.detail) {
          detail = payload.detail
        }
      } catch {
        // Ignore parse errors and use default detail.
      }
      throw new Error(detail)
    }

    return response.json()
  },

  analyzeDocument: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/ai/analyze-document', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      let detail = 'Failed to analyze document.'
      try {
        const payload = await response.json()
        if (payload?.detail) {
          detail = payload.detail
        }
      } catch {
        // Ignore parse errors and use default detail.
      }
      throw new Error(detail)
    }

    return response.json()
  },
}
