'use client';

import React, { useState } from 'react';
import './page.css';

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSearch() {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3005/api/submissions/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setResults(data);
        } catch (err) {
            setError('Failed to fetch results');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container">
            <div className="search-box">
                <h1>Welcome to SPEED</h1>
                <input
                    type="text"
                    placeholder="Search by title, author, journal..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                {error && <p className="error">{error}</p>}
            </div>

            <div className="results">
                {results.length > 0 && (
                    <ul>
                        {results.map((item) => (
                            <li key={item._id}>
                                <strong>{item.title}</strong> — {item.authors} ({item.journal})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}