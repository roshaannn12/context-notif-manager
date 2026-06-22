"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DEFAULT_SCHEDULE = [
  {
    context: "Work",
    startTime: "09:00",
    endTime: "18:00",
    icon: "💼",
    color: "#3b82f6",
  },
  {
    context: "Leisure",
    startTime: "18:00",
    endTime: "22:00",
    icon: "🎮",
    color: "#22c55e",
  },
  {
    context: "Sleep",
    startTime: "22:00",
    endTime: "09:00",
    icon: "😴",
    color: "#a855f7",
  },
];

const getCurrentScheduledContext = (schedule) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const item of schedule) {
    const [startH, startM] = item.startTime.split(":").map(Number);
    const [endH, endM] = item.endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes < endMinutes) {
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return item.context;
      }
    } else {
      // Overnight (e.g. Sleep: 22:00 - 09:00)
      if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
        return item.context;
      }
    }
  }
  return null;
};

export default function AutoContext({ user, switchContext, darkMode }) {
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [currentScheduled, setCurrentScheduled] = useState(null);
  const [lastSwitched, setLastSwitched] = useState(null);
  const [message, setMessage] = useState(null);

  // Check and auto switch every minute
  useEffect(() => {
    if (!autoEnabled) return;

    const check = async () => {
      const scheduled = getCurrentScheduledContext(schedule);
      setCurrentScheduled(scheduled);

      if (
        scheduled &&
        scheduled !== user.currentContext &&
        scheduled !== lastSwitched
      ) {
        await switchContext(scheduled);
        setLastSwitched(scheduled);
        setMessage({
          type: "success",
          text: `Auto switched to ${scheduled} mode!`,
        });
        setTimeout(() => setMessage(null), 3000);
      }
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [autoEnabled, schedule, user.currentContext, lastSwitched]);

  const updateSchedule = (index, field, value) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

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
          Auto Context
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Automatically switch context based on time of day
        </p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          {message.text}
        </motion.div>
      )}

      {/* Enable Toggle */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "var(--text-primary)",
                margin: "0 0 4px",
              }}
            >
              Auto Context Switching
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Current time: {currentTime}{" "}
              {currentScheduled && `→ Should be in ${currentScheduled} mode`}
            </p>
          </div>
          <motion.button
            onClick={() => setAutoEnabled(!autoEnabled)}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "52px",
              height: "28px",
              borderRadius: "14px",
              border: "none",
              background: autoEnabled ? "#3b82f6" : "#e2e8f0",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s ease",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "white",
                position: "absolute",
                top: "3px",
                left: autoEnabled ? "27px" : "3px",
                transition: "left 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </motion.button>
        </div>

        {/* Info box */}
        <div
          style={{
            background: autoEnabled ? "#eff6ff" : "var(--bg-secondary)",
            borderRadius: "10px",
            padding: "12px",
            border: `1px solid ${autoEnabled ? "#bfdbfe" : "var(--border)"}`,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: autoEnabled ? "#3b82f6" : "var(--text-muted)",
              margin: 0,
            }}
          >
            {autoEnabled
              ? "✅ Auto switching is ON — context will change automatically based on schedule below"
              : "⚪ Auto switching is OFF — turn on to enable automatic context switching"}
          </p>
        </div>
      </div>

      {/* Schedule */}
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
            marginBottom: "16px",
            letterSpacing: "0.06em",
          }}
        >
          SCHEDULE
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schedule.map((item, index) => (
            <motion.div
              key={item.context}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                border: `1px solid ${currentScheduled === item.context && autoEnabled ? item.color : "var(--border)"}`,
              }}
            >
              <span style={{ fontSize: "24px" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: "0 0 8px",
                  }}
                >
                  {item.context}
                  {currentScheduled === item.context && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "20px",
                        background: item.color + "20",
                        color: item.color,
                        fontWeight: "600",
                      }}
                    >
                      NOW
                    </span>
                  )}
                </p>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) =>
                      updateSchedule(index, "startTime", e.target.value)
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    to
                  </span>
                  <input
                    type="time"
                    value={item.endTime}
                    onChange={(e) =>
                      updateSchedule(index, "endTime", e.target.value)
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div
        style={{
          background: darkMode ? "#1e3a5f" : "#eff6ff",
          borderRadius: "14px",
          padding: "16px",
          border: `1px solid ${darkMode ? "#334155" : "#bfdbfe"}`,
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: darkMode ? "#93c5fd" : "#3b82f6",
            margin: "0 0 8px",
          }}
        >
          💡 How it works
        </p>
        <p
          style={{
            fontSize: "12px",
            color: darkMode ? "#93c5fd" : "#1d4ed8",
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          When enabled, the app checks the time every minute and automatically
          switches your context based on the schedule above. You can still
          manually override it anytime!
        </p>
      </div>
    </div>
  );
}
