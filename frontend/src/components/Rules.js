"use client";
import { motion, AnimatePresence } from "framer-motion";

const CONTEXTS = ["Work", "Leisure", "Sleep", "Focus", "Commute"];
const ACTIONS = ["allow", "mute", "snooze"];
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

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e" },
  Sleep: { bg: "#faf5ff", text: "#a855f7" },
  Focus: { bg: "#fff7ed", text: "#f97316" },
  Commute: { bg: "#fefce8", text: "#eab308" },
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

export default function Rules({
  rules,
  newRule,
  setNewRule,
  addRule,
  deleteRule,
  rulesLoading,
  darkMode,
  duplicateError,
  setDuplicateError,
}) {
  const actionColors = darkMode ? ACTION_COLORS_DARK : ACTION_COLORS;

  return (
    <div style={{ padding: "32px", flex: 1, overflowY: "auto" }}>
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
          Notification Rules
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Define how each app behaves in different contexts
        </p>
      </div>

      {/* Rule Builder */}
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
            marginBottom: "14px",
            letterSpacing: "0.06em",
          }}
        >
          ADD NEW RULE
        </p>

        {/* Preview */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              margin: "0 0 4px",
            }}
          >
            Preview
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            <span style={{ color: "var(--accent)", fontWeight: "600" }}>
              {newRule.appName}
            </span>{" "}
            will be{" "}
            <span
              style={{
                fontWeight: "600",
                color:
                  newRule.action === "allow"
                    ? "#16a34a"
                    : newRule.action === "mute"
                      ? "#dc2626"
                      : "#d97706",
              }}
            >
              {newRule.action === "allow"
                ? "allowed"
                : newRule.action === "mute"
                  ? "muted"
                  : "snoozed"}
            </span>{" "}
            during{" "}
            <span
              style={{
                color: CONTEXT_COLORS[newRule.context]?.text,
                fontWeight: "600",
              }}
            >
              {newRule.context}
            </span>{" "}
            mode
          </p>
        </div>

        {/* Selectors */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          {[
            { label: "APP", key: "appName", options: APPS },
            { label: "CONTEXT", key: "context", options: CONTEXTS },
            { label: "ACTION", key: "action", options: ACTIONS },
          ].map((field) => (
            <div key={field.key}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                {field.label}
              </label>
              <select
                value={newRule[field.key]}
                onChange={(e) =>
                  setNewRule({ ...newRule, [field.key]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <motion.button
          onClick={addRule}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          {/* Duplicate Error Popup */}
          {duplicateError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#dc2626",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {duplicateError}
                </p>
              </div>
              <button
                onClick={() => setDuplicateError(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  fontSize: "16px",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </motion.div>
          )}
          + Add Rule
        </motion.button>
      </div>

      {/* Rules List */}
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
            marginBottom: "14px",
            letterSpacing: "0.06em",
          }}
        >
          YOUR RULES ({rules.length})
        </p>

        {rulesLoading ? (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Loading rules...
          </p>
        ) : rules.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>⚙️</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              No rules yet — add one above!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <AnimatePresence>
              {rules.map((rule) => {
                const colors = actionColors[rule.action];
                return (
                  <motion.div
                    key={rule._id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>
                        {APP_ICONS[rule.appName]}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        {rule.appName}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "var(--text-muted)" }}
                      >
                        during
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: darkMode
                            ? "var(--accent-light)"
                            : CONTEXT_COLORS[rule.context]?.bg,
                          color: CONTEXT_COLORS[rule.context]?.text,
                        }}
                      >
                        {rule.context}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "var(--text-muted)" }}
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
                        {rule.action}
                      </span>
                    </div>
                    <motion.button
                      onClick={() => deleteRule(rule._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </motion.button>
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
