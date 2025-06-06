'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./LoginForm.css";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset error
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
    
      if (data.success&& data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      {/* left side form */}
      <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="input-row">
            <span className="input-icon">📧</span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-row">
            <span className="input-icon">🔒</span>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {message && <div style={{ color: "red", marginTop: 10 }}>{message}</div>}
          <div className="signup-tip">
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </div>
        </form>

      {/* right side image */}
      <div className="login-img">
        <Image
          src="/login.jpg"
          alt="Login Illustration"
          width={300}
          height={340}
        />
      </div>
    </div>
  );
}