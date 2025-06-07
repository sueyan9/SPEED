import React, { useEffect, useRef, useState } from "react";
import "./Header.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dayOfWeek = currentTime.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = currentTime.toLocaleDateString("en-CA");
  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleInputClick = async () => {
    setDropdownVisible(true);

    if (searchQuery.trim() !== "") return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/submissions`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };
  // search function
  const doSearch = async () => {
    if (!searchQuery.trim()) return;
    setDropdownVisible(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/submissions/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Failed to search");
      const results = await res.json();
      setSubmissions(results);
    } catch (error) {
      setError(error.message);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
  };

  return (
    <div className="header-root">
      <div className="header-logo">
        <span className="header-logo-red">Dash</span>board
      </div>

      <div className="header-search-container" ref={dropdownRef}>
        <input
            className="header-search"
            placeholder="Search articles here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onClick={handleInputClick}
          />
        <button className="header-search-btn"onClick={doSearch}>Search</button>
            {dropdownVisible && (
                <div className="dropdown-box">
                  {loading && <div>Loading submissions...</div>}
                  {error && <div style={{color: "red"}}>{error}</div>}
                  {!loading && !error && submissions.length === 0 && <div>No submissions found</div>}
                  {!loading && !error && submissions.length > 0 && (
                      <ul className="dropdown-list">
                        {submissions.map((sub) => (
                            <li key={sub._id} className="dropdown-item">
                              <strong>{sub.title}</strong> {sub.authors ? ` - ${sub.authors}` : ""}
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
            )}
      </div>

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
