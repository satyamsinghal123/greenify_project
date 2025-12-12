import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId;

  const [amount, setAmount] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate("/donation");
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="payment-page success">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Thank You!</h2>
          <p>Your donation of ${amount} has been received.</p>
          <p>Redirecting back to campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Secure Donation</h2>
          <p>Complete your contribution securely.</p>
        </div>

        <form className="payment-form" onSubmit={handlePayment}>
          <div className="form-group">
            <label>Donation Amount ($)</label>
            <div className="amount-options">
              {[10, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`amount-btn ${amount === val ? "active" : ""}`}
                  onClick={() => setAmount(val)}
                >
                  ${val}
                </button>
              ))}
              <input
                type="number"
                className="custom-amount"
                placeholder="Custom"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Card Information</label>
            <div className="card-input-wrapper">
              <input type="text" placeholder="Card Number" className="card-number" required />
              <div className="card-row">
                <input type="text" placeholder="MM/YY" className="card-expiry" required />
                <input type="text" placeholder="CVC" className="card-cvc" required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Name on Card</label>
            <input type="text" placeholder="Full Name" required />
          </div>

          <button type="submit" className="pay-btn" disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Donate $${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
