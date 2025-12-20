import React, { useState } from 'react';
import paymentsService from '../../services/paymentsService';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ApplyPromoCode = ({ bookingAmount, onPromoApplied }) => {
  const [promoCode, setPromoCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = await paymentsService.validatePromoCode(promoCode, bookingAmount);
      setValidationResult(result);
      if (result.valid) {
        toast.success(result.message || 'Promo code applied successfully!');
        if (onPromoApplied) {
          onPromoApplied(result);
        }
      } else {
        toast.error(result.message || 'Invalid promo code.');
      }
    } catch (err) {
      setError('Failed to validate promo code.');
      let errorMessage = 'Failed to validate promo code.';
      if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
      console.error('Error validating promo code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Apply Promo Code</h5>
        <Form onSubmit={handleApplyPromo}>
          <Form.Group className="mb-3">
            <Form.Label>Promo Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Applying...' : 'Apply Code'}
          </Button>
        </Form>

        {validationResult && (
          <div className="mt-3">
            {validationResult.valid ? (
              <Alert variant="success">
                <p className="mb-1 fw-bold">{validationResult.message || 'Promo code is valid!'}</p>
                <p className="mb-0">Discount: ${validationResult.discount_amount?.toFixed(2)}</p>
                <p className="mb-0">Final Amount: ${validationResult.final_amount?.toFixed(2)}</p>
              </Alert>
            ) : (
              <Alert variant="danger">
                {validationResult.message || 'Invalid promo code.'}
              </Alert>
            )}
          </div>
        )}

        {error && !validationResult && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ApplyPromoCode;
