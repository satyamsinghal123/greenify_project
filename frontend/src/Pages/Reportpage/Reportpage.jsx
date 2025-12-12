import React, { useState } from "react";
import "../Reportpage/Report.css";

function Reportpage({ show, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!show) return null;

  const reportCategories = [
    { value: "spam", label: "Spam or misleading", icon: "🚫", desc: "Irrelevant or annoying content" },
    { value: "harmful", label: "Harmful content", icon: "⚠️", desc: "Dangerous or unsafe acts" },
    { value: "inappropriate", label: "Inappropriate", icon: "🔞", desc: "Not suitable for general audience" },
    { value: "harassment", label: "Harassment", icon: "😔", desc: "Bullying or threatening behavior" },
    { value: "false_info", label: "False information", icon: "🤥", desc: "Misleading or fake news" },
    { value: "other", label: "Other", icon: "📝", desc: "Something else" }
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("Please select a report category.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(reason, selectedCategory);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setReason("");
        setSelectedCategory("");
        onClose();
      }, 2000);
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

  if (showSuccess) {
    return (
      <div className="report-backdrop">
        <div className="report-modal success-modal">
          <div className="success-icon">✅</div>
          <h2>Thanks for reporting</h2>
          <p>We've received your report and will review it shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-backdrop" onClick={handleOverlayClick}>
      <div className="report-modal">
        {/* Header */}
        <div className="report-header">
          <div className="header-content">
            <h2>Report Content</h2>
            <p>Help us keep Greenify safe</p>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close report modal"
          >
            ×
          </button>
        </div>

        <div className="report-body">
          {/* Report Categories */}
          <div className="report-section">
            <label className="section-label">Select a reason</label>
            <div className="categories-grid">
              {reportCategories.map((category) => (
                <button
                  key={category.value}
                  className={`category-btn ${selectedCategory === category.value ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category.value)}
                  type="button"
                >
                  <span className="category-icon">{category.icon}</span>
                  <div className="category-text">
                    <span className="category-label">{category.label}</span>
                    <span className="category-desc">{category.desc}</span>
                  </div>
                  {selectedCategory === category.value && <span className="check-icon">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="report-section">
            <label className="section-label">
              Additional details <span className="optional">(optional)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                placeholder="Provide more context..."
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
        </div>

        {/* Footer Actions */}
        <div className="report-footer">
          <div className="help-text">
            <span className="help-icon">🔒</span>
            Your report is anonymous
          </div>
          <div className="action-buttons">
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
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportpage;