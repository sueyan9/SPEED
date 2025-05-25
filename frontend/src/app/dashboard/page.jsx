"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import SubmissionForm from "../../components/SubmissionForm";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submits, setSubmits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      if (u && t) {
        setUser(JSON.parse(u));
        setToken(t);
      }
    }
  }, []);

  useEffect(() => {
    if (!user || !token) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      let url = "http://localhost:3005/api/submissions";
      if (user.role === "user") {
        url += `?userId=${user._id}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      console.log("submissions api response:", data);
      if (Array.isArray(data)) {
        setSubmits(data);
      } else if (Array.isArray(data.data)) {
        setSubmits(data.data);
      } else {
        setSubmits([]);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [user, token]);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("http://localhost:3005/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: "pending",
          userId: user._id,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      setSubmits([...submits, data]);
      setShowModal(false);
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  };

  const handleReview = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3005/api/submissions/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to review");
      setSubmits(submits.map((s) => (s._id === id ? { ...s, status } : s)));
    } catch (err) {
      alert("Review failed: " + err.message);
    }
  };

  const handleAnalyst = async (id, status) => {
    try {
      const res = await fetch(
          `http://localhost:3005/api/submissions/${id}/analyst_review`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          }
      );
      if (!res.ok) throw new Error("Failed to review");
      setSubmits(submits.map((s) => (s._id === id ? { ...s, status } : s)));
    } catch (err) {
      alert("Review failed: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-body">
          <Sidebar user={user} onNewSubmit={() => setShowModal(true)} />
          <div className="main-content">
            <div className="content">
              <div className="welcome">
                Welcome back, {user.username} <span>👋</span>
              </div>
              <div className="cards-row">
                {/* User */}
                {user.role === "user" && (
                    <>
                      <div className="card-col">
                        <div className="pending-header">
                          <div className="card-title pending">
                            <span></span>
                            <h2>Pending</h2>
                          </div>
                          <button
                              className="new-submit-btn"
                              onClick={() => setShowModal(true)}
                          >
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

                      <div className="card-col">
                        <div className="card-title completed">
                          <span></span>
                          <h2>Completed Submit</h2>
                        </div>
                        {submits
                            .filter(
                                (s) =>
                                    s.status === "analyst_approved" &&
                                    s.author === user.username
                            )
                            .map((item, idx) => (
                                <div key={idx} className="card card-completed">
                                  <img
                                      src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96"
                                      alt="thumb"
                                      className="card-thumb"
                                  />
                                  <div>
                                    <div className="card-title-text">{item.title}</div>
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
                    </>
                )}

                {/* Moderator */}
                {user.role === "moderator" && (
                    <div className="card-col">
                      <div className="card-title pending">
                        <span></span>
                        <h2>Pending Submissions</h2>
                      </div>
                      {submits
                          .filter((s) => s.status === "pending")
                          .map((item) => (
                              <div key={item._id} className="card">
                                <img
                                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96"
                                    alt="thumb"
                                    className="card-thumb"
                                />
                                <div>
                                  <div className="card-title-text">{item.title}</div>
                                  <a
                                      className="card-link"
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                  >
                                    {item.link}
                                  </a>
                                  <p className="card-summary">{item.summary}</p>
                                  <div style={{ marginTop: 8 }}>
                                    <button
                                        onClick={() =>
                                            handleReview(item._id, "moderator_approved")
                                        }
                                        style={{ marginRight: 8 }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleReview(item._id, "rejected")
                                        }
                                        style={{ color: "red" }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                          ))}
                    </div>
                )}

                {/* Analyst */}
                {user.role === "analyst" && (
                    <div className="card-col">
                      <div className="card-title pending">
                        <span></span>
                        <h2>Moderator Approved</h2>
                      </div>
                      {submits
                          .filter((s) => s.status === "moderator_approved")
                          .map((item) => (
                              <div key={item._id} className="card">
                                <img
                                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96"
                                    alt="thumb"
                                    className="card-thumb"
                                />
                                <div>
                                  <div className="card-title-text">{item.title}</div>
                                  <a
                                      className="card-link"
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                  >
                                    {item.link}
                                  </a>
                                  <p className="card-summary">{item.summary}</p>
                                  <div style={{ marginTop: 8 }}>
                                    <button
                                        onClick={() =>
                                            handleAnalyst(item._id, "analyst_approved")
                                        }
                                        style={{ marginRight: 8 }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAnalyst(item._id, "rejected")
                                        }
                                        style={{ color: "red" }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                          ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && user.role === "user" && (
            <div className="modal-mask">
              <div className="modal">
                <div className="modal-header">
                  <h2>Add New Submit</h2>
                  <button
                      className="modal-close"
                      onClick={() => setShowModal(false)}
                  >
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