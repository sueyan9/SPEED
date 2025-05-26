import React, { useState, useEffect } from "react";

export default function SubmissionForm({ onSubmit, onCancel, initialData }) {
    const [formData, setFormData] = useState(
        initialData || {
            title: "",
            authors: "",
            journal: "",
            year: "",
            volume: "",
            number: "",
            pages: "",
            doi: "",
            claim: "",
            evidence: "",
            status: "pending", // default status
        }
    );
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        // Validate required fields
        if (
            !formData.title ||
            !formData.authors ||
            !formData.journal ||
            !formData.year ||
            !formData.doi ||
            !formData.claim ||
            !formData.evidence
        ) {
            setMessage("Please fill in all required fields.");
            return;
        }

        if (onSubmit) {
            onSubmit(formData); // logic for using parent components
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="modal-input"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="authors"
                placeholder="Authors"
                value={formData.authors}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="journal"
                placeholder="Journal"
                value={formData.journal}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="year"
                placeholder="Publication Year"
                value={formData.year}
                onChange={handleChange}
                type="number"
            />
            <input
                className="modal-input"
                name="volume"
                placeholder="Volume"
                value={formData.volume}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="number"
                placeholder="Number"
                value={formData.number}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="pages"
                placeholder="Pages"
                value={formData.pages}
                onChange={handleChange}
            />
            <input
                className="modal-input"
                name="doi"
                placeholder="DOI"
                value={formData.doi}
                onChange={handleChange}
            />
            <select
                className="modal-input"
                name="claim"
                value={formData.claim}
                onChange={handleChange}
            >
                <option value="">Select Claim</option>
                <option value="Code Quality Improvement">Code Quality Improvement</option>
                <option value="Product Quality Improvement">Product Quality Improvement</option>
                <option value="Team Satisfaction Improvement">Team Satisfaction Improvement</option>
            </select>
            <select
                className="modal-input"
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
            >
                <option value="">Select Evidence Strength</option>
                <option value="Strong support">Strong support</option>
                <option value="Weak support">Weak support</option>
                <option value="Weak against">Weak against</option>
            </select>

            <div className="modal-actions">
                <button type="button" onClick={onCancel} className="modal-btn cancel">
                    Cancel
                </button>
                <button type="submit" className="modal-btn create">
                    Create
                </button>
            </div>
            {message && <div style={{ color: "red", marginTop: 10 }}>{message}</div>}
        </form>
    );
}
