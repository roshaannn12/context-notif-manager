"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e" },
  Sleep: { bg: "#faf5ff", text: "#a855f7" },
  Focus: { bg: "#fff7ed", text: "#f97316" },
  Commute: { bg: "#fefce8", text: "#eab308" },
};

const CONTEXT_ICONS = {
  Work: "💼",
  Leisure: "🎮",
  Sleep: "😴",
  Focus: "🎯",
  Commute: "🚗",
};

const ACTION_COLORS = {
  allow: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  mute: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  snooze: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
};

const ACTION_COLORS_DARK = {
  allow: { bg: "#052e16", text: "#4ade80", border: "#14532d" },
  mute: { bg: "#2d0a0a", text: "#f87171", border: "#7f1d1d" },
  snooze: { bg: "#2d1a00", text: "#fbbf24", border: "#78350f" },
};

const APP_ICONS = {
  Instagram: "📸",
  Gmail: "📧",
  Slack: "💬",
  WhatsApp: "📱",
  YouTube: "▶️",
  Twitter: "🐦",
  Discord: "🎮",
  Telegram: "✈️",
};

const CONTEXTS = ["Work", "Leisure", "Sleep", "Focus", "Commute"];
const MAX_NOTIFICATIONS = 12;

export default function Dashboard({
  user,
  rules,
  switchContext,
  darkMode,
  customContexts,
  onAddContext,
  onDeleteContext,
}) {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ muted: 0, snoozed: 0, allowed: 0 });

  const getStatus = (appName) => {
    const rule = rules.find(
      (r) => r.appName === appName && r.context === user.currentContext,
    );
    return rule ? rule.action : "allow";
  };

  useEffect(() => {
    const current = rules.filter((r) => r.context === user.currentContext);
    setStats({
      muted: current.filter((r) => r.action === "mute").length,
      snoozed: current.filter((r) => r.action === "snooze").length,
      allowed: current.filter((r) => r.action === "allow").length,
    });
  }, [rules, user.currentContext]);

  useEffect(() => {
    const socket = io("https://context-notif-manager-backend.onrender.com");
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev].slice(0, MAX_NOTIFICATIONS));
    });
    return () => socket.disconnect();
  }, []);

  const actionColors = darkMode ? ACTION_COLORS_DARK : ACTION_COLORS;

  return (
    <div
      style={{ padding: "clamp(16px, 4vw, 32px)", flex: 1, overflowY: "auto" }}
    >
      {/* Mobile Header */}
      <div
        className="mobile-header"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            🔔 NotifManager
          </p>
          <p
            style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}
          >
            Hi {user.name}! 👋
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            padding: "4px 10px",
            borderRadius: "20px",
            background: CONTEXT_COLORS[user.currentContext]?.bg || "#eff6ff",
            color: CONTEXT_COLORS[user.currentContext]?.text || "#3b82f6",
          }}
        >
          {CONTEXT_ICONS[user.currentContext] || "⭐"} {user.currentContext}
        </span>
      </div>

      {/* Desktop Header */}
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: "0 0 4px",
            }}
          >
            Dashboard
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            You're in{" "}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                background: darkMode
                  ? "var(--accent-light)"
                  : CONTEXT_COLORS[user.currentContext]?.bg || "#eff6ff",
                color: CONTEXT_COLORS[user.currentContext]?.text || "#3b82f6",
              }}
            >
              {CONTEXT_ICONS[user.currentContext] || "⭐"} {user.currentContext}
            </span>{" "}
            mode
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "20px",
            background: connected ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${connected ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: connected ? "#22c55e" : "#ef4444",
              animation: connected ? "pulse 1.5s infinite" : "none",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: connected ? "#16a34a" : "#dc2626",
            }}
          >
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      {/* Context Switcher */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "var(--text-muted)",
            marginBottom: "12px",
            letterSpacing: "0.06em",
          }}
        >
          SWITCH CONTEXT
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CONTEXTS.map((context) => {
            const isActive = user.currentContext === context;
            return (
              <motion.button
                key={context}
                onClick={() => switchContext(context)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: isActive
                    ? `2px solid ${CONTEXT_COLORS[context]?.text}`
                    : "1px solid var(--border)",
                  background: isActive
                    ? darkMode
                      ? "var(--accent-light)"
                      : CONTEXT_COLORS[context]?.bg
                    : "var(--bg-secondary)",
                  color: isActive
                    ? CONTEXT_COLORS[context]?.text
                    : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: isActive ? "600" : "400",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{CONTEXT_ICONS[context]}</span>
                {context}
              </motion.button>
            );
          })}

          {customContexts.map((context) => {
            const isActive = user.currentContext === context.name;
            return (
              <div
                key={context._id}
                style={{ position: "relative", display: "inline-flex" }}
              >
                <motion.button
                  onClick={() => switchContext(context.name)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: isActive
                      ? `2px solid ${context.color}`
                      : "1px solid var(--border)",
                    background: isActive
                      ? context.color + "20"
                      : "var(--bg-secondary)",
                    color: isActive ? context.color : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: isActive ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    paddingRight: "28px",
                  }}
                >
                  <span>{context.icon}</span>
                  {context.name}
                </motion.button>
                <button
                  onClick={() => onDeleteContext(context._id)}
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    padding: "2px",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}

          <motion.button
            onClick={onAddContext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px dashed var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            + Add Context
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Muted",
            value: stats.muted,
            color: "#dc2626",
            lightBg: "#fef2f2",
            darkBg: "#2d0a0a",
            icon: "🔇",
          },
          {
            label: "Snoozed",
            value: stats.snoozed,
            color: "#d97706",
            lightBg: "#fffbeb",
            darkBg: "#2d1a00",
            icon: "⏰",
          },
          {
            label: "Allowed",
            value: stats.allowed,
            color: "#16a34a",
            lightBg: "#f0fdf4",
            darkBg: "#052e16",
            icon: "✅",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: darkMode ? stat.darkBg : stat.lightBg,
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>
              {stat.icon}
            </div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: stat.color,
                margin: "0 0 2px",
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Live Notification Feed */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "14px",
          padding: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            LIVE NOTIFICATION FEED
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {notifications.length} notifications
          </span>
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>📭</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Waiting for notifications...
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <AnimatePresence initial={false}>
              {notifications.map((notif) => {
                const status = getStatus(notif.app);
                const colors = actionColors[status];
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{
                      opacity: status === "mute" ? 0.4 : 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.bg,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>
                        {APP_ICONS[notif.app]}
                      </span>
                      <div>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            margin: 0,
                          }}
                        >
                          {notif.app}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            margin: 0,
                          }}
                        >
                          {status === "mute" ? "🔇 Muted" : notif.message}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 6px",
                        borderRadius: "20px",
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        flexShrink: 0,
                      }}
                    >
                      {status}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
