import { useRef, useState } from 'react'

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt']
const ACCEPT_ATTR = '.pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

function getExtension(filename = '') {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? `.${parts.pop()}` : ''
}

export default function DocumentUpload({ disabled = false, onFileSelected }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleFile = (file) => {
    if (!file) return

    const extension = getExtension(file.name)
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setLocalError('Unsupported file format.')
      setFileName('')
      return
    }

    setLocalError('')
    setFileName(file.name)
    onFileSelected?.(file)
  }

  return (
    <div className="document-upload">
      <div className="document-upload__header">
        <h3>Document Upload</h3>
        <p>Upload PDF, DOCX, or TXT complaint documents.</p>
      </div>

      <div
        className={[
          'document-dropzone',
          isDragging ? 'is-dragging' : '',
          disabled ? 'is-disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (disabled) return
          const file = event.dataTransfer.files?.[0]
          handleFile(file)
        }}
      >
        <p className="document-dropzone__title">📄 Drag & drop a complaint document</p>
        <p className="document-dropzone__hint">or</p>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Browse File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          hidden
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0]
            handleFile(file)
            event.target.value = ''
          }}
        />
      </div>

      {fileName ? (
        <p className="document-upload__filename">
          Selected: <strong>{fileName}</strong>
        </p>
      ) : null}

      {localError ? <p className="copilot-error">{localError}</p> : null}
    </div>
  )
}
