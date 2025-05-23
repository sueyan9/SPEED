import React, { useEffect, useState } from "react";
import "./Header.css";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // cleanup function to clear the interval
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = currentTime.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = currentTime.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="header-root">
      <div className="header-logo">
        <span className="header-logo-red">Dash</span>board
      </div>
      <input
        className="header-search"
        placeholder="Search articles here..."
      />
      <div className="header-right">
        <span role="img" aria-label="bell">🔔</span>
        <span role="img" aria-label="calendar">📅</span>
        <span>
          {dayOfWeek} <br />
          <span className="header-date-bold">{dateStr} {timeStr}</span>
        </span>
      </div>
    </div>
  );
}