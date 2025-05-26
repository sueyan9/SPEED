'use client';
import React, { useState } from "react";
import Image from 'next/image';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./SignupForm.css";
 
export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
  });
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset error
    if (!agree) {
      setMessage("Please agree to the terms and conditions");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3005/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Registered Successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
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
        <div className="input-row">
          <FaUser className="input-icon" />
          <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="analyst">Analyst</option>
          </select>
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
          I agree to all terms
        </label>
        <button
          type="submit"
          className="signup-btn"
          disabled={!agree || loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ color: "red", marginTop: 10 }}>{message}</div>
        <div className="signin-tip">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
}