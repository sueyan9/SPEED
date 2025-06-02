import './Sidebar.css';
import React from "react";

export default function Sidebar({ onNewSubmit }) {
  return (
    <div className="sidebar">
      {/* User Info */}
      <div className="user-info">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className="avatar"
        />
        <div className="username">Sundar Gurung</div>
        <div className="email">sundar@gmail.com</div>
      </div>
      {/* Menu */}
      <nav className="menu">
        <button className="menu-item active">
          <span>🏠</span> Dashboard
        </button>
        <div className="menu-item">
          <span>🔔</span> Notification
        </div>
        <div className="menu-item">
          <span>📄</span> My Submit
        </div>
        <button className="menu-item" onClick={onNewSubmit}>
          <span>➕</span> New Submit
        </button>
        <div className="menu-item">
          <span>⚙️</span> Settings
        </div>
        <div className="menu-item">
          <span>❓</span> Help
        </div>
      </nav>
      <div className="logout menu-item">
        <span>🚪</span> Logout
      </div>
    </div>
  );
}