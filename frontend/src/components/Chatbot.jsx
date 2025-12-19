import { useState, useRef, useEffect } from 'react'
import { Button, Card, Form } from 'react-bootstrap'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! 👋 I\'m your Rentora assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
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
    '📍 Locations',
    '🎫 Book a car',
    '❓ Help'
  ]

  const botResponses = {
    pricing: 'Our prices start from $50/day and go up to $500/day depending on the vehicle. We offer:\n\n• Economy cars: $50-80/day\n• SUVs: $100-200/day\n• Luxury vehicles: $250-500/day\n\nAll rentals include insurance and unlimited mileage!',
    
    locations: 'We have multiple pickup locations:\n\n📍 Downtown San Francisco\n📍 San Francisco Airport (SFO)\n📍 Oakland\n📍 San Jose\n\nYou can select your preferred location during booking.',
    
    booking: 'Booking is easy! Just follow these steps:\n\n1️⃣ Search for available vehicles\n2️⃣ Select your dates and location\n3️⃣ Choose your perfect car\n4️⃣ Complete payment\n\nWould you like me to help you start a booking?',
    
    requirements: 'To rent a car, you need:\n\n✓ Valid driver\'s license (21+ years)\n✓ Credit or debit card\n✓ Proof of insurance\n\nInternational drivers need an International Driving Permit (IDP).',
    
    insurance: 'All our rentals include:\n\n🛡️ Comprehensive insurance\n🛡️ Collision damage waiver\n🛡️ Theft protection\n🛡️ Third-party liability\n\nAdditional coverage options are available at checkout.',
    
    cancel: 'Our cancellation policy:\n\n✅ Free cancellation up to 24 hours before pickup\n⚠️ 50% refund if cancelled 12-24 hours before\n❌ No refund for same-day cancellations\n\nYou can modify your booking anytime from your dashboard.',
    
    default: 'I can help you with:\n\n• Finding the perfect vehicle\n• Pricing and discounts\n• Booking process\n• Pickup locations\n• Insurance information\n• Cancellation policy\n\nWhat would you like to know more about?'
  }

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')) {
      return botResponses.pricing
    } else if (msg.includes('location') || msg.includes('where') || msg.includes('pickup')) {
      return botResponses.locations
    } else if (msg.includes('book') || msg.includes('rent') || msg.includes('reserve')) {
      return botResponses.booking
    } else if (msg.includes('requirement') || msg.includes('need') || msg.includes('license')) {
      return botResponses.requirements
    } else if (msg.includes('insurance') || msg.includes('coverage') || msg.includes('protection')) {
      return botResponses.insurance
    } else if (msg.includes('cancel') || msg.includes('refund') || msg.includes('modify')) {
      return botResponses.cancel
    } else {
      return botResponses.default
    }
  }

  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return

    const userMessage = {
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botMessage = {
        type: 'bot',
        text: getBotResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickReply = (reply) => {
    const cleanReply = reply.replace(/[🚗💰📍🎫❓]/g, '').trim()
    handleSend(cleanReply)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
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
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  marginRight: '10px',
                  animation: 'pulse 2s infinite'
                }}
              />
              <div>
                <h6 className="mb-0 fw-bold">Rentora Assistant</h6>
                <small style={{ opacity: 0.9 }}>Online • Typically replies instantly</small>
              </div>
            </div>
            <Button
              variant="link"
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', padding: 0 }}
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
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.type === 'user' 
                      ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                      : 'white',
                    color: msg.type === 'user' ? 'white' : '#1a1a1a',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      marginTop: '0.25rem',
                      opacity: 0.7,
                      textAlign: 'right'
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '16px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      padding: '0.35rem 0.75rem'
                    }}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
            <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ borderRadius: '20px', flex: 1 }}
                />
                <Button
                  type="submit"
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ➤
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  )
}