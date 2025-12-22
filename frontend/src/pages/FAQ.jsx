import { Container, Accordion, Card, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')

  const faqCategories = [
    {
      category: 'Booking & Reservations',
      icon: '📅',
      questions: [
        {
          question: 'How do I book a vehicle?',
          answer: 'Booking is simple! Browse our vehicles, select your preferred car, choose your pickup date and duration, then complete the payment process. You\'ll receive instant confirmation via email.'
        },
        {
          question: 'Can I modify or cancel my reservation?',
          answer: 'Yes! You can modify or cancel bookings from your dashboard. Cancellations made 48+ hours before pickup receive a full refund. 24-48 hours: 50% refund. Less than 24 hours: no refund.'
        },
        {
          question: 'Do I need to create an account to book?',
          answer: 'Yes, you need to create a free account to make bookings. This allows you to manage your reservations, view booking history, and access exclusive member benefits.'
        },
        {
          question: 'How far in advance should I book?',
          answer: 'We recommend booking at least 24-48 hours in advance, especially during peak seasons. However, same-day bookings are available subject to vehicle availability.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      icon: '💳',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards with credit card logos, and business accounts for corporate clients.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees! Your booking shows the complete breakdown: daily rate, insurance, taxes, and any optional add-ons. The price you see is the price you pay.'
        },
        {
          question: 'Do you offer discounts for long-term rentals?',
          answer: 'Yes! We offer special rates for rentals of 7 days or more. Weekly rates save up to 15%, and monthly rates save up to 30%. Contact us for custom corporate rates.'
        },
        {
          question: 'When will I be charged?',
          answer: 'Your payment is processed at the time of booking. A hold may be placed on your card for the security deposit, which is released upon vehicle return in good condition.'
        }
      ]
    },
    {
      category: 'Vehicle & Insurance',
      icon: '🚗',
      questions: [
        {
          question: 'What insurance is included?',
          answer: 'Basic insurance is included with all rentals, covering collision damage with a deductible. You can upgrade to Standard ($15/day) or Premium ($25/day) coverage for better protection and lower deductibles.'
        },
        {
          question: 'What if the vehicle breaks down?',
          answer: 'We provide 24/7 roadside assistance for all our vehicles. Call our emergency hotline at +1 (234) 567-8999, and we\'ll send help immediately or arrange a replacement vehicle.'
        },
        {
          question: 'Can I add an additional driver?',
          answer: 'Yes, additional drivers can be added for $10/day each. All drivers must meet our age and license requirements and be present at pickup with valid documentation.'
        },
        {
          question: 'Are your vehicles regularly maintained?',
          answer: 'Absolutely! All vehicles undergo comprehensive maintenance checks before each rental. We follow manufacturer-recommended service schedules and conduct safety inspections.'
        }
      ]
    },
    {
      category: 'Pickup & Return',
      icon: '📍',
      questions: [
        {
          question: 'What do I need to bring at pickup?',
          answer: 'Bring your valid driver\'s license, credit card in your name, booking confirmation, and proof of insurance (or purchase our coverage). International renters need a passport and international driving permit.'
        },
        {
          question: 'Can I pick up at one location and return at another?',
          answer: 'Yes! One-way rentals are available between select locations. Additional fees may apply depending on the distance and route. Check availability during booking.'
        },
        {
          question: 'What happens if I return the vehicle late?',
          answer: 'A 30-minute grace period is provided. After that, you\'ll be charged hourly for up to 2 hours, then a full day rate. Please call us if you expect to be late.'
        },
        {
          question: 'What is your fuel policy?',
          answer: 'Vehicles come with a full tank and should be returned full. If returned with less fuel, you\'ll be charged the fuel cost plus a $25 service fee. Prepaid fuel options are available.'
        }
      ]
    },
    {
      category: 'Requirements & Eligibility',
      icon: '✅',
      questions: [
        {
          question: 'What is the minimum age to rent?',
          answer: 'Minimum age is 21 years for standard vehicles. Drivers aged 21-24 pay a young driver surcharge. Luxury and specialty vehicles require drivers to be 25+.'
        },
        {
          question: 'Do you accept international licenses?',
          answer: 'Yes! We accept valid international driver\'s licenses along with an International Driving Permit (IDP). Some countries may have specific requirements.'
        },
        {
          question: 'Can I rent without a credit card?',
          answer: 'A credit card in the driver\'s name is required for the security deposit. Debit cards are accepted for payment but a credit card is still needed for the deposit.'
        },
        {
          question: 'Are there mileage restrictions?',
          answer: 'Most rentals include unlimited mileage within the rental state. Out-of-state travel may have mileage limits or require additional fees. Check your rental agreement for details.'
        }
      ]
    },
    {
      category: 'Special Circumstances',
      icon: '🔧',
      questions: [
        {
          question: 'What should I do in case of an accident?',
          answer: 'First, ensure everyone\'s safety and call 911 if needed. Then contact us immediately at +1 (234) 567-8999. Document everything with photos, get a police report, and exchange information with other parties.'
        },
        {
          question: 'Can I take the vehicle out of state?',
          answer: 'Yes, most vehicles can travel to neighboring states. Some restrictions apply to luxury vehicles and one-way rentals. Always inform us of your travel plans during booking.'
        },
        {
          question: 'Do you offer vehicles for people with disabilities?',
          answer: 'Yes! We have wheelchair-accessible vehicles and hand-control equipped cars available. Please contact us at least 48 hours in advance to ensure availability.'
        },
        {
          question: 'What if I need to extend my rental?',
          answer: 'Contact us before your return date to request an extension. If the vehicle is available, we\'ll extend at the daily rate. Unauthorized extensions will result in additional fees.'
        }
      ]
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted fs-5">Find answers to common questions about our rental services</p>
        </div>

        {/* Search Bar */}
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  border: '2px solid #e2e8f0'
                }}
              />
            </div>
          </Col>
        </Row>

        {/* FAQ Categories */}
        {filteredCategories.length === 0 ? (
          <Card className="border-0 shadow-sm text-center p-5">
            <h5 className="fw-bold mb-2">No results found</h5>
            <p className="text-muted">Try adjusting your search terms</p>
          </Card>
        ) : (
          <div className="mb-5">
            {filteredCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <h3 className="fw-bold mb-0">{category.category}</h3>
                </div>

                <Accordion>
                  {category.questions.map((item, qIndex) => (
                    <Accordion.Item
                      key={qIndex}
                      eventKey={`${catIndex}-${qIndex}`}
                      style={{
                        border: 'none',
                        marginBottom: '0.75rem',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Accordion.Header style={{ borderRadius: '12px' }}>
                        <strong>{item.question}</strong>
                      </Accordion.Header>
                      <Accordion.Body className="text-muted">
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <Card className="border-0 shadow-sm mt-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <Card.Body className="p-5 text-center text-white">
            <h3 className="fw-bold mb-3">Still have questions?</h3>
            <p className="mb-4">Our support team is here to help you 24/7</p>
            <div className="d-flex gap-3 justify-content-center">
              <Button
                as={Link}
                to="/contact"
                size="lg"
                variant="light"
                style={{ borderRadius: '10px', padding: '12px 32px' }}
              >
                Contact Support
              </Button>
              <Button
                href="tel:+12345678900"
                size="lg"
                variant="outline-light"
                style={{ borderRadius: '10px', padding: '12px 32px' }}
              >
                📞 Call Us
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}