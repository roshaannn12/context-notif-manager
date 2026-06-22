"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e" },
  Sleep: { bg: "#faf5ff", text: "#a855f7" },
  Focus: { bg: "#fff7ed", text: "#f97316" },
  Commute: { bg: "#fefce8", text: "#eab308" },
};

// Analyze rules and generate suggestions
const generateSuggestions = (rules, currentContext) => {
  const suggestions = [];
  const APPS = [
    "Instagram",
    "Gmail",
    "Slack",
    "WhatsApp",
    "YouTube",
    "Twitter",
    "Discord",
    "Telegram",
  ];
  const CONTEXTS = ["Work", "Leisure", "Sleep", "Focus", "Commute"];

  // Check which app+context combos don't have rules yet
  APPS.forEach((app) => {
    CONTEXTS.forEach((context) => {
      const hasRule = rules.find(
        (r) => r.appName === app && r.context === context,
      );
      if (!hasRule) {
        // Generate smart suggestions based on common patterns
        if (
          context === "Sleep" &&
          ["Instagram", "Twitter", "YouTube", "Discord"].includes(app)
        ) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "mute",
            reason: `Most people mute ${app} during Sleep mode`,
            confidence: 92,
          });
        }
        if (
          context === "Work" &&
          ["Instagram", "YouTube", "Twitter"].includes(app)
        ) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "mute",
            reason: `${app} can be distracting during Work hours`,
            confidence: 85,
          });
        }
        if (
          context === "Focus" &&
          ["Instagram", "Twitter", "YouTube", "Discord", "Telegram"].includes(
            app,
          )
        ) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "mute",
            reason: `Stay focused — mute ${app} during Focus mode`,
            confidence: 88,
          });
        }
        if (context === "Work" && ["Gmail", "Slack"].includes(app)) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "allow",
            reason: `${app} is important for work communication`,
            confidence: 90,
          });
        }
        if (context === "Sleep" && ["Gmail", "Slack"].includes(app)) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "mute",
            reason: `Don't let work notifications disturb your sleep`,
            confidence: 95,
          });
        }
        if (context === "Commute" && ["Slack", "Gmail"].includes(app)) {
          suggestions.push({
            id: `${app}-${context}`,
            app,
            context,
            action: "snooze",
            reason: `Snooze ${app} during commute — check when you arrive`,
            confidence: 78,
          });
        }
      }
    });
  });

  // Sort by confidence
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
};

export default function AiSuggestions({ user, rules, addRule, darkMode }) {
  const [suggestions, setSuggestions] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [added, setAdded] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const generated = generateSuggestions(rules, user?.currentContext);
    const filtered = generated.filter(
      (s) => !dismissed.includes(s.id) && !added.includes(s.id),
    );
    setSuggestions(filtered);
  }, [rules, dismissed, added]);

  const handleAdd = async (suggestion) => {
    setLoading(suggestion.id);
    await addRule(suggestion.app, suggestion.context, suggestion.action);
    setAdded([...added, suggestion.id]);
    setLoading(null);
  };

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id]);
  };

  const ACTION_COLORS = {
    allow: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    mute: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    snooze: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  };

  return (
    <div
      style={{ padding: "clamp(16px, 4vw, 32px)", flex: 1, overflowY: "auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: "0 0 4px",
          }}
        >
          AI Suggestions
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Smart rule suggestions based on common notification patterns
        </p>
      </div>

      {/* Info Card */}
      <div
        style={{
          background: darkMode ? "#1e3a5f" : "#eff6ff",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "20px",
          border: `1px solid ${darkMode ? "#334155" : "#bfdbfe"}`,
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: darkMode ? "#93c5fd" : "#3b82f6",
            margin: "0 0 6px",
          }}
        >
          🤖 How AI Suggestions work
        </p>
        <p
          style={{
            fontSize: "12px",
            color: darkMode ? "#93c5fd" : "#1d4ed8",
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          We analyze your existing rules and common notification patterns to
          suggest new rules you might find useful. Each suggestion shows a
          confidence score!
        </p>
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
          { label: "Rules Active", value: rules.length, color: "#3b82f6" },
          { label: "Suggestions", value: suggestions.length, color: "#a855f7" },
          { label: "Dismissed", value: dismissed.length, color: "#94a3b8" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--bg-card)",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: stat.color,
                margin: "0 0 4px",
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestions List */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "14px",
          padding: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "var(--text-muted)",
            marginBottom: "16px",
            letterSpacing: "0.06em",
          }}
        >
          SUGGESTED RULES ({suggestions.length})
        </p>

        {suggestions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              All caught up!
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              No new suggestions — your rules are well configured!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <AnimatePresence>
              {suggestions.map((suggestion) => {
                const colors = ACTION_COLORS[suggestion.action];
                const contextColors = CONTEXT_COLORS[suggestion.context] || {
                  bg: "#f1f5f9",
                  text: "#64748b",
                };
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      background: "var(--bg-secondary)",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>
                          {APP_ICONS[suggestion.app]}
                        </span>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                              }}
                            >
                              {suggestion.app}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                              }}
                            >
                              during
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                padding: "2px 8px",
                                borderRadius: "20px",
                                background: contextColors.bg,
                                color: contextColors.text,
                              }}
                            >
                              {suggestion.context}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                              }}
                            >
                              →
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
                              {suggestion.action}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              margin: "4px 0 0",
                            }}
                          >
                            {suggestion.reason}
                          </p>
                        </div>
                      </div>

                      {/* Confidence */}
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#3b82f6",
                            margin: 0,
                          }}
                        >
                          {suggestion.confidence}%
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          match
                        </p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div
                      style={{
                        height: "4px",
                        background: "var(--border)",
                        borderRadius: "999px",
                        marginBottom: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${suggestion.confidence}%` }}
                        transition={{ duration: 0.6 }}
                        style={{
                          height: "100%",
                          background: "#3b82f6",
                          borderRadius: "999px",
                        }}
                      />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <motion.button
                        onClick={() => handleAdd(suggestion)}
                        disabled={loading === suggestion.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#3b82f6",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {loading === suggestion.id ? "Adding..." : "✓ Add Rule"}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDismiss(suggestion.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Dismiss
                      </motion.button>
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
