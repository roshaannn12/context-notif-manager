"use client";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "rules", label: "Rules", icon: "⚙️" },
  { id: "analytics", label: "Analytics", icon: "📈" },
];

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6", dot: "#3b82f6" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" },
  Sleep: { bg: "#faf5ff", text: "#a855f7", dot: "#a855f7" },
  Focus: { bg: "#fff7ed", text: "#f97316", dot: "#f97316" },
  Commute: { bg: "#fefce8", text: "#eab308", dot: "#eab308" },
};

const CONTEXT_ICONS = {
  Work: "💼",
  Leisure: "🎮",
  Sleep: "😴",
  Focus: "🎯",
  Commute: "🚗",
};

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onLogout,
}) {
  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              🔔 NotifManager
            </h1>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Context-Aware
            </p>
          </div>
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "24px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {user.name[0]}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Context:
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 8px",
                borderRadius: "20px",
                background: darkMode
                  ? "var(--accent-light)"
                  : CONTEXT_COLORS[user.currentContext]?.bg,
                color: CONTEXT_COLORS[user.currentContext]?.text,
              }}
            >
              {CONTEXT_ICONS[user.currentContext]} {user.currentContext}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeTab === item.id ? "600" : "400",
              background:
                activeTab === item.id ? "var(--accent-light)" : "transparent",
              color:
                activeTab === item.id
                  ? "var(--accent)"
                  : "var(--text-secondary)",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              color: "#dc2626",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            🚪 Logout
          </button>
        )}
        <div
          style={{
            background: "var(--accent-light)",
            borderRadius: "10px",
            padding: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--accent)",
              margin: "0 0 3px",
            }}
          >
            MVP — Phase 1
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            AI features coming in Phase 3
          </p>
        </div>
      </div>
    </div>
  );
}
