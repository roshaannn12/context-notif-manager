"use client";
import { motion } from "framer-motion";

const CONTEXT_COLORS = {
  Work: { bg: "#eff6ff", text: "#3b82f6", bar: "#3b82f6" },
  Leisure: { bg: "#f0fdf4", text: "#22c55e", bar: "#22c55e" },
  Sleep: { bg: "#faf5ff", text: "#a855f7", bar: "#a855f7" },
  Focus: { bg: "#fff7ed", text: "#f97316", bar: "#f97316" },
  Commute: { bg: "#fefce8", text: "#eab308", bar: "#eab308" },
};

const CONTEXT_ICONS = {
  Work: "💼",
  Leisure: "🎮",
  Sleep: "😴",
  Focus: "🎯",
  Commute: "🚗",
};

const CONTEXTS = ["Work", "Leisure", "Sleep", "Focus", "Commute"];

export default function Analytics({ rules, darkMode }) {
  const getContextStats = (context) => {
    const contextRules = rules.filter((r) => r.context === context);
    return {
      muted: contextRules.filter((r) => r.action === "mute").length,
      snoozed: contextRules.filter((r) => r.action === "snooze").length,
      allowed: contextRules.filter((r) => r.action === "allow").length,
      total: contextRules.length,
    };
  };

  const totalMuted = rules.filter((r) => r.action === "mute").length;
  const totalSnoozed = rules.filter((r) => r.action === "snooze").length;
  const totalAllowed = rules.filter((r) => r.action === "allow").length;
  const configuredContexts = CONTEXTS.filter(
    (c) => getContextStats(c).total > 0,
  ).length;

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
          Analytics
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Insights across all your notification rules
        </p>
      </div>

      {/* Overall Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Total Rules",
            value: rules.length,
            color: "#3b82f6",
            lightBg: "#eff6ff",
            darkBg: "#1e3a5f",
            icon: "📋",
          },
          {
            label: "Muted",
            value: totalMuted,
            color: "#dc2626",
            lightBg: "#fef2f2",
            darkBg: "#2d0a0a",
            icon: "🔇",
          },
          {
            label: "Snoozed",
            value: totalSnoozed,
            color: "#d97706",
            lightBg: "#fffbeb",
            darkBg: "#2d1a00",
            icon: "⏰",
          },
          {
            label: "Allowed",
            value: totalAllowed,
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
                fontSize: "26px",
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
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Per Context Breakdown */}
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
            marginBottom: "18px",
            letterSpacing: "0.06em",
          }}
        >
          RULES PER CONTEXT
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {CONTEXTS.map((context, i) => {
            const stats = getContextStats(context);
            const barWidth =
              rules.length > 0 ? (stats.total / rules.length) * 100 : 0;
            return (
              <motion.div
                key={context}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
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
                      {CONTEXT_ICONS[context]}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {context}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    {stats.total} rules
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: "6px",
                    background: "var(--bg-secondary)",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginBottom: "6px",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }}
                    style={{
                      height: "100%",
                      background: CONTEXT_COLORS[context]?.bar,
                      borderRadius: "999px",
                    }}
                  />
                </div>

                {/* Mini Stats */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "#dc2626" }}>
                    🔇 {stats.muted} muted
                  </span>
                  <span style={{ fontSize: "11px", color: "#d97706" }}>
                    ⏰ {stats.snoozed} snoozed
                  </span>
                  <span style={{ fontSize: "11px", color: "#16a34a" }}>
                    ✅ {stats.allowed} allowed
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
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
          SUMMARY
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {[
            {
              label: "Total Rules Created",
              value: rules.length,
              color: "#3b82f6",
            },
            {
              label: "Contexts Configured",
              value: configuredContexts,
              color: "#a855f7",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-secondary)",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: item.color,
                  margin: "0 0 4px",
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
