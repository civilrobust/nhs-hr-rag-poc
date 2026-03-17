import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!question.trim()) return

    // Add user question to chat
    const userMessage = { type: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)
    setError(null)

    try {
      // Call API
      const response = await axios.post('/api/ask', {
        question: question
      })

      // Add AI response to chat
      const aiMessage = {
        type: 'ai',
        text: response.data.answer,
        sources: response.data.sources
      }
      setMessages(prev => [...prev, aiMessage])

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer. Is the backend running?')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const exampleQuestions = [
    "How many days sick leave am I entitled to?",
    "Can I work from home?",
    "What is the annual leave entitlement?",
    "What happens if I need to take parental leave?",
    "How do I request flexible working?"
  ]

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="nhs-logo">
          <div className="nhs-logo-box">NHS</div>
        </div>
        <h1>NHS ICT HR Policy Assistant</h1>
        <p className="subtitle">Ask questions about HR policies and get instant answers</p>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <h2>👋 Welcome!</h2>
            <p>Ask me anything about NHS ICT HR policies. Try one of these:</p>
            <div className="example-questions">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  className="example-btn"
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type}`}>
                <div className="message-header">
                  {msg.type === 'user' ? '👤 You' : '🤖 HR Assistant'}
                </div>
                <div className="message-content">
                  {msg.text}
                </div>
                {msg.sources && (
                  <div className="sources">
                    <div className="sources-header">📄 Sources:</div>
                    {msg.sources.map((source, j) => (
                      <div key={j} className="source-item">
                        <span className="source-name">{source.source}</span>
                        <span className="source-relevance">
                          {(1 - source.distance).toFixed(2)}% relevant
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <div className="message-header">🤖 HR Assistant</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about sick leave, annual leave, remote working..."
          className="question-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !question.trim()}
        >
          {loading ? '⏳' : '🚀'} Ask
        </button>
      </form>

      {/* Footer */}
      <div className="footer">
        <p>💡 Powered by Llama 3.1 8B • ChromaDB • FastAPI</p>
        <p className="disclaimer">This is a demonstration system using synthetic policy documents</p>
      </div>
    </div>
  )
}

export default App
