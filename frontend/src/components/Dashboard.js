"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6", dark: "#1e3a5f" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e", dark: "#052e16" },
  Sleep: { bg: "#faf5ff", text: "#a855f7", dark: "#2e1065" },
  Focus: { bg: "#fff7ed", text: "#f97316", dark: "#431407" },
  Commute: { bg: "#fefce8", text: "#eab308", dark: "#1a1200" },
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

export default function Dashboard({ user, rules, switchContext, darkMode }) {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ muted: 0, snoozed: 0, allowed: 0 });

  const getStatus = (appName) => {
    const rule = rules.find(
      (r) => r.appName === appName && r.context === user.currentContext,
    );
    return rule ? rule.action : "allow";
  };

  // Update stats when rules or context changes
  useEffect(() => {
    const current = rules.filter((r) => r.context === user.currentContext);
    setStats({
      muted: current.filter((r) => r.action === "mute").length,
      snoozed: current.filter((r) => r.action === "snooze").length,
      allowed: current.filter((r) => r.action === "allow").length,
    });
  }, [rules, user.currentContext]);

  // WebSocket connection
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("new-notification", (notif) => {
      setNotifications((prev) => {
        const updated = [notif, ...prev];
        return updated.slice(0, MAX_NOTIFICATIONS);
      });
    });

    return () => socket.disconnect();
  }, []);

  const actionColors = darkMode ? ACTION_COLORS_DARK : ACTION_COLORS;

  return (
    <div style={{ padding: "32px", flex: 1, overflowY: "auto" }}>
      {/* Header */}
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
                  : CONTEXT_COLORS[user.currentContext]?.bg,
                color: CONTEXT_COLORS[user.currentContext]?.text,
              }}
            >
              {CONTEXT_ICONS[user.currentContext]} {user.currentContext}
            </span>{" "}
            mode
          </p>
        </div>

        {/* Live indicator */}
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

      {/* Pulse animation */}
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
          padding: "20px",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px",
          }}
        >
          {CONTEXTS.map((context) => {
            const isActive = user.currentContext === context;
            return (
              <motion.button
                key={context}
                onClick={() => switchContext(context)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 6px",
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
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "18px" }}>
                  {CONTEXT_ICONS[context]}
                </span>
                {context}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div
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
              padding: "20px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>
              {stat.icon}
            </div>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: stat.color,
                margin: "0 0 2px",
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Apps {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Live Notification Feed */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "14px",
          padding: "20px",
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
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.bg,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>
                        {APP_ICONS[notif.app]}
                      </span>
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
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
                          {status === "mute"
                            ? "🔇 Notification muted"
                            : notif.message}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{ fontSize: "11px", color: "var(--text-muted)" }}
                      >
                        {notif.time}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {status}
                      </span>
                    </div>
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
