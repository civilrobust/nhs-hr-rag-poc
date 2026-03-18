import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ chunks: 0, policies: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      setStats({
        chunks: response.data.total_chunks,
        policies: response.data.policies_loaded
      })
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
      const response = await axios.post('/api/ask', {
        question: question
      })

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
    <div className="app-container">
      <div className="header">
        {messages.length > 0 && (
          <button className="new-chat-btn" onClick={handleNewChat}>
            ← New Chat
          </button>
        )}
        <div className="nhs-logo">
          <div className="nhs-logo-box">NHS</div>
        </div>
        <h1>NHS ICT HR Policy Assistant</h1>
        <p className="subtitle">Ask questions about HR policies and get instant answers</p>
      </div>

      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="hero-section">
              <h2>👋 Welcome to Your AI HR Assistant!</h2>
              <p className="hero-description">
                Powered by advanced AI, this assistant searches through all NHS ICT HR policies 
                to give you accurate, instant answers with source citations.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">
                  <AnimatedCounter end={stats.chunks} />
                </div>
                <div className="stat-label">Policy Chunks Indexed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  <AnimatedCounter end={stats.policies} />
                </div>
                <div className="stat-label">HR Policies Loaded</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">⚡</div>
                <div className="stat-label">Instant Answers</div>
              </div>
            </div>

            <div className="how-it-works">
              <h3>🔍 How It Works</h3>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Ask Your Question</h4>
                    <p>Type any HR policy question in plain English</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>AI Searches Policies</h4>
                    <p>Semantic search finds relevant sections</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Get Cited Answer</h4>
                    <p>AI generates answer with source references</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="examples-section">
              <h3>💬 Try Asking...</h3>
              <div className="example-questions">
                {exampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="example-btn"
                    onClick={() => setQuestion(q)}
                  >
                    <span className="example-icon">💡</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <h4>Accurate</h4>
                <p>Answers based only on official policies</p>
              </div>
              <div className="feature">
                <span className="feature-icon">📚</span>
                <h4>Cited</h4>
                <p>Every answer shows its source</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <h4>Fast</h4>
                <p>Get answers in seconds</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <h4>Private</h4>
                <p>Runs locally on your machine</p>
              </div>
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
                {msg.sources && msg.sources.length > 0 && (
                  <div className="sources">
                    <div className="sources-header">
                      📄 Referenced Policy Sections
                      <span className="sources-hint">
                        Answer based on {msg.sources.length} section{msg.sources.length > 1 ? 's' : ''} from official HR policies
                      </span>
                    </div>
                    {(() => {
                      const grouped = msg.sources.reduce((acc, source) => {
                        if (!acc[source.source]) {
                          acc[source.source] = 0
                        }
                        acc[source.source]++
                        return acc
                      }, {})

                      return Object.entries(grouped).map(([filename, count]) => (
                        <div key={filename} className="source-group">
                          <div className="source-filename">
                            📄 {filename.replace(/_/g, ' ').replace('.txt', '')}
                            {count > 1 && (
                              <span className="section-count">{count} sections</span>
                            )}
                          </div>
                        </div>
                      ))
                    })()}
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

      <div className="footer">
        <p>💡 Powered by Llama 3.1 8B • ChromaDB • FastAPI • React</p>
        <p className="disclaimer">AI Engineering Apprenticeship POC • Synthetic Policy Documents</p>
      </div>
    </div>
  )
}

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

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
