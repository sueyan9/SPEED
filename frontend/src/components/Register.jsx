'use client';
import React, { useState } from "react";
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
        setMessage("Registration Successfully！");
      } else {
        setMessage(data.message || "Registration failed");
    }
} catch (err) {
  setMessage("An error occurred. Please try again later.");
}
};

return (
<form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
  <h2>Sign Up</h2>
  <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
  <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
  <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
  <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
  <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
  <label>
    <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
    I agree to all terms
  </label>
  <button type="submit">Register</button>
  <div style={{ color: "red", marginTop: 10 }}>{message}</div>
</form>
);
}