import React from "react";
import { useNavigate } from "react-router-dom";
import "./DonationPage.css";

function DonationPage() {
  const navigate = useNavigate();

  const donationEvents = [
    {
      id: 1,
      title: "Reforestation Project",
      description: "Help us plant 10,000 trees in the Amazon rainforest to combat deforestation.",
      image: "https://cdn.pixabay.com/photo/2021/07/25/01/00/environment-6490647_1280.jpg",
      target: 50000,
      raised: 32500,
    },
    {
      id: 2,
      title: "Clean Ocean Initiative",
      description: "Support our efforts to remove plastic waste from the Pacific Ocean.",
      image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      target: 25000,
      raised: 15000,
    },
    {
      id: 3,
      title: "Urban Garden Fund",
      description: "Creating green spaces in city centers to improve air quality and community health.",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      target: 10000,
      raised: 8200,
    },
    {
      id: 4,
      title: "Wildlife Protection",
      description: "Protecting endangered species from poaching and habitat loss.",
      image: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      target: 75000,
      raised: 45000,
    },
  ];

  const handleDonate = (eventId) => {
    navigate("/payment", { state: { eventId } });
  };

  return (
    <div className="donation-page">
      <div className="donation-hero">
        <div className="hero-content">
          <h1>Make a Difference Today</h1>
          <p>Your contribution can help heal the planet. Choose a cause close to your heart.</p>
        </div>
      </div>

      <div className="events-container">
        <h2>Active Campaigns</h2>
        <div className="events-grid">
          {donationEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-overlay"></div>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Raised: ${event.raised.toLocaleString()}</span>
                    <span>Goal: ${event.target.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(event.raised / event.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button className="donate-btn" onClick={() => handleDonate(event.id)}>
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DonationPage;
