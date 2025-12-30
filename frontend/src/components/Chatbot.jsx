import { useState, useRef, useEffect } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { startChatSession, sendChatMessage } from '../services/chatService'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    '🚗 Browse vehicles',
    '💰 Pricing info',
    '🎫 Book a car',
    '❓ Help'
  ]

  // ===============================
  // Open Chat & Start Session
  // ===============================
  const openChat = async () => {
    setIsOpen(true)

    if (!sessionId) {
      try {
        setIsLoadingSession(true)
        const data = await startChatSession()

        setSessionId(data.id)

        // Initial bot greeting (created by backend)
        if (data.messages && data.messages.length > 0) {
          setMessages([
            {
              type: 'bot',
              text: data.messages[0].content,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          ])
        }
      } catch (err) {
        console.error('Failed to start chat session', err)
      } finally {
        setIsLoadingSession(false)
      }
    }
  }

  // ===============================
  // Send Message
  // ===============================
  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || !sessionId) return

    const userMessage = {
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const data = await sendChatMessage(sessionId, messageText)

      const botMessage = {
        type: 'bot',
        text: data.bot_message.content,
        time: new Date(data.bot_message.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: '⚠️ Something went wrong. Please try again.',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply) => {
    const clean = reply.replace(/[🚗💰🎫❓]/gu, '').trim()
    handleSend(clean)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={openChat}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)',
            zIndex: 9999,
            fontSize: '1.5rem'
          }}
        >
          💬
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            height: '600px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: 'none'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <strong>Rentora Assistant</strong>
            <Button
              variant="link"
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', fontSize: '1.5rem', padding: 0 }}
            >
              ×
            </Button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f8fafc'
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.75rem'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius:
                      msg.type === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    background:
                      msg.type === 'user'
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                        : '#ffffff',
                    color: msg.type === 'user' ? 'white' : '#1a1a1a',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ fontStyle: 'italic', opacity: 0.7 }}>
                Rentora is typing…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div style={{ padding: '0.5rem' }}>
              {quickReplies.map((q, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleQuickReply(q)}
                  style={{ margin: '0.25rem', borderRadius: '20px' }}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit">➤</Button>
              </div>
            </Form>
          </div>
        </Card>
      )}
    </>
  )
}
        