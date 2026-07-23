"use client";
import { useState, useMemo } from "react";

/**
 * matchFields: array of row keys to search against (case-insensitive substring)
 * chips: array of { value, label } — value "" means "Tous"
 * statusKey: row key to compare against chip value
 * children: render-prop function (filteredRows) => JSX
 */
export default function SearchFilter({ rows, matchFields, chips, statusKey, placeholder, children }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        !query ||
        matchFields.some((key) => (row[key] || "").toString().toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = !status || row[statusKey] === status;
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, status, matchFields, statusKey]);

  return (
    <>
      <div className="toolbar">
        <input
          className="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {chips.map((c) => (
          <span
            key={c.value}
            className={status === c.value ? "chip active" : "chip"}
            onClick={() => setStatus(c.value)}
            style={{ cursor: "pointer" }}
          >
            {c.label}
          </span>
        ))}
      </div>
      {children(filtered)}
    </>
  );
}
