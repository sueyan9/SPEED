'use client';
import React, { useState } from "react";
import Image from 'next/image';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./SignupForm.css";
 

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setMessage("Please agree to the terms and conditions");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:3005/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Registered Successfully！");
      } else {
        setMessage(data.message || "Registration failed");
    }
} catch (err) {
  setMessage("An error occurred. Please try again later.");
}
};

return (
  <div className="signup-card">
    {/* left side image */}
    <div className="signup-img">
      <Image
        src="/signup.jpg"
        alt="Signup Illustration"
        width={300}
        height={340}
      />
    </div>
    {/* right side form */}
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div className="input-row">
        <FaUser className="input-icon" />
        <input name="firstName" placeholder="Enter First Name" value={form.firstName} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <FaUser className="input-icon" />
        <input name="lastName" placeholder="Enter Last Name" value={form.lastName} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <FaUser className="input-icon" />
        <input name="username" placeholder="Enter Username" value={form.username} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <FaEnvelope className="input-icon" />
        <input name="email" type="email" placeholder="Enter Email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <FaLock className="input-icon" />
        <input name="password" type="password" placeholder="Enter Password" value={form.password} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <FaLock className="input-icon" />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
      </div>
      <label className="checkbox-row">
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
        I agree to all terms
      </label>
      <button
        type="submit"
        className="signup-btn"
        disabled={!agree}
      >
        Register
      </button>
      <div style={{ color: "red", marginTop: 10 }}>{message}</div>
      <div className="signin-tip">
        Already have an account? <a href="/login">Sign In</a>
      </div>
    </form>
  </div>
);
}