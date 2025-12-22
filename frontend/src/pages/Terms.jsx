import { Container, Card } from 'react-bootstrap'

export default function Terms() {
  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-5">
            <h1 className="fw-bold mb-4 text-center">Terms & Conditions</h1>
            <p className="text-muted text-center mb-5">
              Last updated: December 20, 2024
            </p>

            <div className="terms-content">
              <section className="mb-5">
                <h3 className="fw-bold mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted">
                  By accessing and using Renato's vehicle rental services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">2. Rental Requirements</h3>
                <p className="text-muted mb-3">To rent a vehicle from Renato, you must:</p>
                <ul className="text-muted">
                  <li>Be at least 21 years of age (25 for luxury vehicles)</li>
                  <li>Possess a valid driver's license</li>
                  <li>Have a valid credit card in your name</li>
                  <li>Provide proof of insurance or purchase our coverage</li>
                  <li>Present valid identification</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">3. Booking and Payment</h3>
                <p className="text-muted mb-3">
                  All bookings made through our platform are subject to availability. Payment is required at the time of booking. We accept:
                </p>
                <ul className="text-muted">
                  <li>Major credit cards (Visa, MasterCard, American Express)</li>
                  <li>Debit cards with credit card logos</li>
                  <li>Business accounts for corporate clients</li>
                </ul>
                <p className="text-muted mt-3">
                  Prices are subject to change without notice. The price confirmed at booking is the price you will pay, regardless of subsequent price changes.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">4. Cancellation Policy</h3>
                <p className="text-muted mb-3">
                  Cancellations made:
                </p>
                <ul className="text-muted">
                  <li><strong>48+ hours before pickup:</strong> Full refund</li>
                  <li><strong>24-48 hours before pickup:</strong> 50% refund</li>
                  <li><strong>Less than 24 hours:</strong> No refund</li>
                </ul>
                <p className="text-muted mt-3">
                  No-shows result in full charge and no refund. Modifications to existing bookings may incur additional fees.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">5. Vehicle Use and Restrictions</h3>
                <p className="text-muted mb-3">The rented vehicle must not be used:</p>
                <ul className="text-muted">
                  <li>For any illegal purpose or in violation of any law</li>
                  <li>By anyone other than the authorized driver(s)</li>
                  <li>To carry passengers or property for hire</li>
                  <li>To tow or push anything</li>
                  <li>In any race, speed test, or contest</li>
                  <li>While under the influence of alcohol or drugs</li>
                  <li>Off-road or on unpaved roads (unless vehicle is designated for such use)</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">6. Insurance and Liability</h3>
                <p className="text-muted">
                  Basic insurance is included with all rentals. This covers collision damage up to the vehicle's value with a deductible. Additional coverage options are available:
                </p>
                <ul className="text-muted mt-3">
                  <li><strong>Standard Coverage:</strong> Reduces deductible to $500</li>
                  <li><strong>Premium Coverage:</strong> Zero deductible, roadside assistance included</li>
                </ul>
                <p className="text-muted mt-3">
                  You are responsible for all damages to the vehicle during the rental period, including theft, vandalism, and collision damage not covered by insurance.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">7. Fuel Policy</h3>
                <p className="text-muted">
                  Vehicles are provided with a full tank of fuel and must be returned with a full tank. If the vehicle is returned with less fuel, you will be charged the cost of fuel plus a service fee of $25.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">8. Late Returns</h3>
                <p className="text-muted">
                  If you return the vehicle late, you will be charged for additional rental time. A grace period of 30 minutes is provided. After that:
                </p>
                <ul className="text-muted mt-2">
                  <li>Up to 2 hours late: Charged hourly rate</li>
                  <li>More than 2 hours late: Charged full daily rate</li>
                  <li>24+ hours late: Additional daily charges apply plus late fee</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">9. Accidents and Damage</h3>
                <p className="text-muted mb-3">
                  In case of an accident or damage:
                </p>
                <ul className="text-muted">
                  <li>Contact local authorities immediately</li>
                  <li>Notify Renato within 24 hours</li>
                  <li>Complete an incident report</li>
                  <li>Obtain contact information from all parties involved</li>
                  <li>Take photos of all damage</li>
                </ul>
                <p className="text-muted mt-3">
                  Failure to report an accident may result in denial of insurance coverage and full liability for damages.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">10. Privacy Policy</h3>
                <p className="text-muted">
                  We collect and use personal information in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">11. Limitation of Liability</h3>
                <p className="text-muted">
                  Renato shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, or goodwill arising out of or in connection with your use of our services.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">12. Modifications to Terms</h3>
                <p className="text-muted">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services following any changes constitutes your acceptance of the new terms.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">13. Governing Law</h3>
                <p className="text-muted">
                  These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">14. Contact Information</h3>
                <p className="text-muted mb-2">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <ul className="text-muted" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>📧 Email: legal@renato.com</li>
                  <li>📞 Phone: +1 (234) 567-8900</li>
                  <li>📍 Address: 123 Main Street, San Francisco, CA 94102</li>
                </ul>
              </section>

              <div className="bg-light p-4 rounded text-center mt-5">
                <p className="mb-0 text-muted">
                  <strong>By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</strong>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}