import React, { useState } from "react";
import "../Reportpage/Report.css";

function Reportpage({ show, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const reportCategories = [
    { value: "spam", label: "Spam or misleading", icon: "🚫" },
    { value: "harmful", label: "Harmful content", icon: "⚠️" },
    { value: "inappropriate", label: "Inappropriate", icon: "🔞" },
    { value: "harassment", label: "Harassment", icon: "😔" },
    { value: "false_info", label: "False information", icon: "🤥" },
    { value: "other", label: "Other", icon: "📝" }
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("Please select a report category.");
      return;
    }

    if (reason.trim() === "") {
      alert("Please provide more details about your report.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(reason, selectedCategory);
      setReason("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Report submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="report-backdrop" onClick={handleOverlayClick}>
      <div className="report-modal">
        {/* Header */}
        <div className="report-header">
          <div className="header-icon">🚩</div>
          <div className="header-content">
            <h2>Report Content</h2>
            <p>Help us keep Greenify safe and positive</p>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close report modal"
          >
            ×
          </button>
        </div>

        {/* Report Categories */}
        <div className="report-categories">
          <label className="section-label">What's the issue?</label>
          <div className="categories-grid">
            {reportCategories.map((category) => (
              <button
                key={category.value}
                className={`category-btn ${selectedCategory === category.value ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
                type="button"
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="reason-section">
          <label className="section-label">
            Additional details
            <span className="optional">(optional but helpful)</span>
          </label>
          <div className="textarea-container">
            <textarea
              placeholder="Please provide more details about why you're reporting this content. Your feedback helps us take appropriate action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength="500"
              disabled={isSubmitting}
            />
            <div className="char-count">
              {reason.length}/500
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="help-text">
          <div className="help-icon">💡</div>
          <p>
            Your report is anonymous. The account you're reporting won't see who reported them.
          </p>
        </div>

        {/* Actions */}
        <div className="report-actions">
          <button 
            className="btn cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className={`btn submit-btn ${isSubmitting ? 'submitting' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedCategory}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Submitting...
              </>
            ) : (
              <>
                <span className="btn-icon">📨</span>
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reportpage;