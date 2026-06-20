"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f43f5e",
];

const PRESET_ICONS = [
  "⭐",
  "🏋️",
  "📚",
  "🎵",
  "🍕",
  "🎯",
  "💪",
  "🧘",
  "🎮",
  "✈️",
  "🏠",
  "💼",
  "🌙",
  "☀️",
  "🎨",
  "🏃",
  "🧠",
  "❤️",
];

export default function CustomContextModal({
  userId,
  onClose,
  onAdd,
  darkMode,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [icon, setIcon] = useState("⭐");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      setError("Please enter a context name!");
      return;
    }
    setLoading(true);
    setError(null);
    await onAdd({ userId, name: name.trim(), color, icon });
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          borderRadius: "20px",
          padding: "28px",
          width: "100%",
          maxWidth: "420px",
          border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: darkMode ? "#f1f5f9" : "#0f172a",
              margin: 0,
            }}
          >
            Create Custom Context
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: darkMode ? "#94a3b8" : "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Preview */}
        <div
          style={{
            background: darkMode ? "#0f172a" : "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
            textAlign: "center",
            border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: darkMode ? "#64748b" : "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Preview
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              background: color + "20",
              border: `2px solid ${color}`,
              color: color,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {icon} {name || "My Context"}
          </div>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: darkMode ? "#94a3b8" : "#475569",
              display: "block",
              marginBottom: "6px",
              letterSpacing: "0.04em",
            }}
          >
            CONTEXT NAME
          </label>
          <input
            type="text"
            placeholder="e.g. Gym, Study, Date Night"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              background: darkMode ? "#0f172a" : "#f8fafc",
              color: darkMode ? "#f1f5f9" : "#0f172a",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Icon Picker */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: darkMode ? "#94a3b8" : "#475569",
              display: "block",
              marginBottom: "8px",
              letterSpacing: "0.04em",
            }}
          >
            PICK AN ICON
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {PRESET_ICONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  border:
                    icon === i
                      ? `2px solid ${color}`
                      : `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  background:
                    icon === i
                      ? color + "20"
                      : darkMode
                        ? "#0f172a"
                        : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: darkMode ? "#94a3b8" : "#475569",
              display: "block",
              marginBottom: "8px",
              letterSpacing: "0.04em",
            }}
          >
            PICK A COLOR
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: c,
                  border: color === c ? "3px solid white" : "none",
                  cursor: "pointer",
                  outline: color === c ? `2px solid ${c}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "10px",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              background: "transparent",
              color: darkMode ? "#94a3b8" : "#475569",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <motion.button
            onClick={handleAdd}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "10px",
              border: "none",
              background: color,
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Context"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
