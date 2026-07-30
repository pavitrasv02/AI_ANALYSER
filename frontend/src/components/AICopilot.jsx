import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyAIComplaintData } from '../redux/complaintSlice.js'
import { api } from '../services/api.js'
import DocumentUpload from './DocumentUpload.jsx'

const suggestedPrompts = [
  'Analyze this complaint',
  'Fill the complaint form',
  'Classify the risk',
  'Summarize complaint',
]

const TEXT_ANALYSIS_STEPS = [
  'Reading complaint',
  'Extracting structured information',
  'Identifying product & batch',
  'Assessing risk level',
  'Generating summary',
  'Suggesting CAPA recommendations',
]

const DOCUMENT_ANALYSIS_STEPS = [
  'Reading document...',
  'Extracting complaint...',
  'Identifying product',
  'Reading batch number',
  'Extracting complaint details',
  'Assessing risk',
  'Generating recommendations',
]

export default function AICopilot() {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.complaint.form)
  const messageIdRef = useRef(2)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello. I am your AI Copilot. Paste complaint text, upload a document, or use Analyze Complaint to extract structured QMS fields.',
      time: '09:00',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(-1)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [analysisMode, setAnalysisMode] = useState('text')
  const [toastMessage, setToastMessage] = useState({
    title: '✅ Complaint analyzed successfully',
    subtitle: 'AI extracted the complaint details.',
  })

  const analysisSteps =
    analysisMode === 'document' ? DOCUMENT_ANALYSIS_STEPS : TEXT_ANALYSIS_STEPS

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

  useEffect(() => {
    if (!loading) return undefined

    const timers = analysisSteps.slice(1).map((_, index) =>
      window.setTimeout(() => {
        setActiveStep(index + 1)
      }, (index + 1) * 700),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [loading, analysisSteps])

  useEffect(() => {
    if (!showToast) return undefined
    const timer = window.setTimeout(() => setShowToast(false), 3500)
    return () => window.clearTimeout(timer)
  }, [showToast])

  useEffect(() => {
    if (!analysisComplete) return undefined
    const timer = window.setTimeout(() => {
      setAnalysisComplete(false)
      setActiveStep(-1)
    }, 2800)
    return () => window.clearTimeout(timer)
  }, [analysisComplete])

  const pushAssistantMessage = (text) => {
    setMessages((previous) => [
      ...previous,
      {
        id: messageIdRef.current,
        role: 'assistant',
        text,
        time: getTimestamp(),
      },
    ])
    messageIdRef.current += 1
  }

  const handleAISuccess = (aiResult, mode) => {
    const steps = mode === 'document' ? DOCUMENT_ANALYSIS_STEPS : TEXT_ANALYSIS_STEPS
    dispatch(applyAIComplaintData(aiResult))
    setActiveStep(steps.length - 1)
    setAnalysisComplete(true)
    setShowToast(true)
    setToastMessage(
      mode === 'document'
        ? {
            title: '✅ Document analyzed successfully',
            subtitle: 'AI extracted the complaint details from your document.',
          }
        : {
            title: '✅ Complaint analyzed successfully',
            subtitle: 'AI extracted the complaint details.',
          },
    )

    const summaryText = aiResult.summary || 'Structured complaint data extracted.'
    pushAssistantMessage(summaryText)
  }

  const sendMessage = async (text = input) => {
    const value = text.trim()
    if (!value || loading) return

    const userMessage = {
      id: messageIdRef.current,
      role: 'user',
      text: value,
      time: getTimestamp(),
    }
    messageIdRef.current += 1

    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setError('')
    setAnalysisMode('text')
    setActiveStep(0)
    setAnalysisComplete(false)
    setLoading(true)

    try {
      const aiResult = await api.analyzeComplaint(value)
      handleAISuccess(aiResult, 'text')
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : 'AI request failed. Please try again.'
      setError(errorMessage)
      setAnalysisComplete(false)
      pushAssistantMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeDocument = async (file) => {
    if (!file || loading) return

    setMessages((previous) => [
      ...previous,
      {
        id: messageIdRef.current,
        role: 'user',
        text: `Uploaded document: ${file.name}`,
        time: getTimestamp(),
      },
    ])
    messageIdRef.current += 1

    setError('')
    setAnalysisMode('document')
    setActiveStep(0)
    setAnalysisComplete(false)
    setLoading(true)

    try {
      const aiResult = await api.analyzeDocument(file)
      handleAISuccess(aiResult, 'document')
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : 'Document analysis failed. Please try again.'
      setError(errorMessage)
      setAnalysisComplete(false)
      pushAssistantMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeComplaint = () => {
    const sourceText =
      form.complaintDescription?.trim() ||
      input.trim() ||
      'Analyze this complaint'
    sendMessage(sourceText)
  }

  return (
    <div className="card copilot-card fade-in">
      {showToast ? (
        <div className="success-toast" role="status">
          <strong>{toastMessage.title}</strong>
          <span>{toastMessage.subtitle}</span>
        </div>
      ) : null}

      <div className="section-heading">
        <h2>AI Copilot</h2>
        <p className="card-subtitle">
          Analyze complaint text or upload documents to auto-fill structured QMS fields.
        </p>
      </div>

      <DocumentUpload disabled={loading} onFileSelected={handleAnalyzeDocument} />

      <button
        className="btn btn-primary btn-analyze"
        type="button"
        disabled={loading}
        onClick={handleAnalyzeComplaint}
      >
        {loading && analysisMode === 'text' ? 'Analyzing...' : '👾 Analyze Complaint'}
      </button>

      <div className="prompt-list">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            className="prompt-chip"
            type="button"
            disabled={loading}
            onClick={() => sendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {(loading || analysisComplete) && (
        <div className={`analysis-panel ${analysisComplete ? 'is-complete' : ''}`}>
          <p className="analysis-panel__title">
            {analysisComplete
              ? analysisMode === 'document'
                ? '✅ Document analyzed successfully'
                : '✅ Analysis Complete'
              : analysisMode === 'document'
                ? '📄 Reading document...'
                : '👾 AI Copilot is analyzing...'}
          </p>
          <ul className="analysis-steps">
            {analysisSteps.map((step, index) => {
              const isDone = analysisComplete || index < activeStep
              const isCurrent = !analysisComplete && index === activeStep
              return (
                <li
                  key={step}
                  className={[
                    'analysis-step',
                    isDone ? 'is-done' : '',
                    isCurrent ? 'is-current' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="analysis-step__mark">
                    {isDone ? '✓' : isCurrent ? '•' : '○'}
                  </span>
                  <span>
                    {isCurrent && analysisMode === 'document' && index === 1
                      ? `👾 ${step}`
                      : step}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="chat-box">
        {messages.map((message) => (
          <div key={message.id} className={`msg ${message.role}`}>
            <div className="msg-meta">
              <span>{message.role === 'assistant' ? 'AI Copilot' : 'You'}</span>
              <span>{message.time}</span>
            </div>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask AI Copilot or paste complaint text..."
          disabled={loading}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage()
            }
          }}
        />
        <button
          className="btn btn-primary"
          type="button"
          disabled={loading}
          onClick={() => sendMessage()}
        >
          {loading ? 'Analyzing...' : 'Send'}
        </button>
      </div>
      {error ? <p className="copilot-error">{error}</p> : null}
    </div>
  )
}
