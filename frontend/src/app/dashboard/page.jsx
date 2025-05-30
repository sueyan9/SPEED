"use client";
import React, { useState } from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import SubmissionForm from "../../components/SubmissionForm"; 
import "./Dashboard.css";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [submits, setSubmits] = useState([
    {
      title: "AI Applications in Healthcare",
      link: "https://example.com/ai-healthcare",
      topic: "AI",
      summary: "Exploring AI in modern healthcare systems.",
      status: "pending",
    },
  ]);

  const handleSubmit = async (formData) => {
    // send POST request to backend
    try {
      const res = await fetch("http://localhost:3005/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, status: "pending" })
      });
      if (!res.ok) {
        throw new Error("Failed to submit");
      }
      const data = await res.json();
      // update the submits state
      setSubmits([...submits, data]);
      setShowModal(false);
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-body">
        <Sidebar onNewSubmit={() => setShowModal(true)} />
        <div className="main-content">
          {/* Content */}
          <div className="content">
            <div className="welcome">
              Welcome back, Sundar <span>👋</span>
            </div>
            <div className="cards-row">
              {/* Pending */}
              <div className="card-col">
                <div className="pending-header">
                  <div className="card-title pending">
                    <span></span>
                    <h2>Pending</h2>
                  </div>
                  <button className="new-submit-btn" onClick={() => setShowModal(true)}>
                    + New Submit
                  </button>
                </div>
                {submits
                  .filter((s) => s.status === "pending")
                  .map((item, idx) => (
                    <div key={idx} className="card">
                      <img
                        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96"
                        alt="thumb"
                        className="card-thumb"
                      />
                      <div>
                        <div className="card-title-text">{item.title}</div>
                        <div className="card-topic">{item.topic}</div>
                        <a
                          className="card-link"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.link}
                        </a>
                        <p className="card-summary">{item.summary}</p>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Completed */}
              <div className="card-col">
                <div className="card-title completed">
                  <span></span>
                  <h2>Completed Submit</h2>
                </div>
                <div className="card card-completed">
                  <img
                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96"
                    alt="thumb"
                    className="card-thumb"
                  />
                  <div>
                    <div className="card-title-text">
                      AI Applications in Healthcare
                    </div>
                    <div className="card-topic">AI</div>
                    <a
                      className="card-link"
                      href="https://example.com/ai-healthcare"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://example.com/ai-healthcare
                    </a>
                    <p className="card-summary">
                      Exploring AI in modern healthcare systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-mask">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Submit</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                Go Back
              </button>
            </div>
            <SubmissionForm
              onSubmit={handleSubmit} 
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}