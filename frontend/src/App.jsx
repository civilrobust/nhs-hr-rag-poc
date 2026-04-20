import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ chunks: 0, policies: 0 })
  const messagesEndRef = useRef(null)

  useEffect(() => { fetchStats() }, [])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      setStats({ chunks: response.data.total_chunks, policies: response.data.policies_loaded })
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    const userMessage = { type: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/ask', { question })
      setMessages(prev => [...prev, {
        type: 'ai',
        text: response.data.answer,
        sources: response.data.sources
      }])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setQuestion('')
    setError(null)
  }

  const exampleQuestions = [
    "How many days sick leave am I entitled to?",
    "Can I work from home?",
    "What is the annual leave entitlement?",
    "What happens if I need to take parental leave?",
    "How do I request flexible working?"
  ]

  return (
    <div className="app-shell">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="left-top">
          <div className="nhs-logo-box">NHS</div>
          <h1>HR Policy Assistant</h1>
          <p className="subtitle">King's College Hospital NHS Foundation Trust</p>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-number"><AnimatedCounter end={stats.chunks} /></div>
            <div className="stat-label">Policy Chunks</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number"><AnimatedCounter end={stats.policies} /></div>
            <div className="stat-label">HR Policies</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number">⚡</div>
            <div className="stat-label">Instant</div>
          </div>
        </div>

        <div className="how-it-works">
          <div className="how-title">How it works</div>
          <div className="step-item"><span className="step-num">1</span><span>Ask in plain English</span></div>
          <div className="step-item"><span className="step-num">2</span><span>AI searches all policies</span></div>
          <div className="step-item"><span className="step-num">3</span><span>Get cited answer</span></div>
        </div>

        <div className="examples-section">
          <div className="examples-title">Try asking...</div>
          {exampleQuestions.map((q, i) => (
            <button key={i} className="example-btn" onClick={() => setQuestion(q)}>
              💡 {q}
            </button>
          ))}
        </div>

        <div className="left-footer">
          <div className="feature-pills">
            <span>🎯 Accurate</span>
            <span>📚 Cited</span>
            <span>🔒 Private</span>
          </div>
          <p className="powered-by">Llama 3.1 8B • ChromaDB • FastAPI</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="chat-header">
          <span>💬 Chat</span>
          {messages.length > 0 && (
            <button className="new-chat-btn" onClick={handleNewChat}>← New Chat</button>
          )}
        </div>

        <div className="chat-area">
          {messages.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <p>Ask any question about NHS ICT HR policies and get an instant cited answer.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              <div className="message-label">{msg.type === 'user' ? '👤 You' : '🤖 HR Assistant'}</div>
              <div className="message-bubble">{msg.text}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="sources">
                  <div className="sources-title">📄 Sources</div>
                  {Object.entries(
                    msg.sources.reduce((acc, s) => {
                      acc[s.source] = (acc[s.source] || 0) + 1
                      return acc
                    }, {})
                  ).map(([filename, count]) => (
                    <div key={filename} className="source-chip">
                      {filename.replace(/_/g, ' ').replace('.txt', '')}
                      {count > 1 && <span className="source-count">{count}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="message-label">🤖 HR Assistant</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about sick leave, annual leave, remote working..."
            className="question-input"
            disabled={loading}
          />
          <button type="submit" className="submit-btn" disabled={loading || !question.trim()}>
            {loading ? '⏳' : '🚀'} Ask
          </button>
        </form>
      </div>
    </div>
  )
}

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let startTime, animationFrame
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = (currentTime - startTime) / duration
      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  return <span>{count}</span>
}

export default App
