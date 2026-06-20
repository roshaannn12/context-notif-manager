"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function VipContacts({
  vipContacts,
  onAdd,
  onDelete,
  darkMode,
}) {
  const [app, setApp] = useState("WhatsApp");
  const [contactName, setContactName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!contactName.trim()) {
      setError("Please enter a contact name!");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await onAdd({ app, contactName: contactName.trim() });
    if (result?.error) {
      setError(result.error);
    } else {
      setContactName("");
    }
    setLoading(false);
  };

  // Group contacts by app
  const grouped = APPS.reduce((acc, appName) => {
    const contacts = vipContacts.filter((c) => c.app === appName);
    if (contacts.length > 0) acc[appName] = contacts;
    return acc;
  }, {});

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
          VIP Contacts
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          These contacts always bypass mute rules — their messages always get
          through
        </p>
      </div>

      {/* How it works */}
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
            color: darkMode ? "#93c5fd" : "#3b82f6",
            margin: "0 0 6px",
            fontWeight: "600",
          }}
        >
          💡 How VIP Contacts work
        </p>
        <p
          style={{
            fontSize: "12px",
            color: darkMode ? "#93c5fd" : "#1d4ed8",
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          Even if WhatsApp is muted during Work mode, messages from your VIP
          contacts like "Mom" or "Boss" will still show through. Perfect for
          urgent contacts!
        </p>
      </div>

      {/* Add VIP Contact */}
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
          ADD VIP CONTACT
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px",
                letterSpacing: "0.05em",
              }}
            >
              APP
            </label>
            <select
              value={app}
              onChange={(e) => setApp(e.target.value)}
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
              }}
            >
              {APPS.map((a) => (
                <option key={a} value={a}>
                  {APP_ICONS[a]} {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px",
                letterSpacing: "0.05em",
              }}
            >
              CONTACT NAME
            </label>
            <input
              type="text"
              placeholder="e.g. Mom, Boss, Alex"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                fontSize: "13px",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <motion.button
          onClick={handleAdd}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "Adding..." : "⭐ Add VIP Contact"}
        </motion.button>
      </div>

      {/* VIP Contacts List */}
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
          YOUR VIP CONTACTS ({vipContacts.length})
        </p>

        {vipContacts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>⭐</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              No VIP contacts yet — add one above!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <AnimatePresence>
              {Object.entries(grouped).map(([appName, contacts]) => (
                <motion.div
                  key={appName}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* App Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {APP_ICONS[appName]}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {appName}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        fontWeight: "600",
                        background: darkMode ? "#1e3a5f" : "#eff6ff",
                        color: "#3b82f6",
                      }}
                    >
                      {contacts.length} VIP{contacts.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Contacts */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      paddingLeft: "24px",
                    }}
                  >
                    {contacts.map((contact) => (
                      <motion.div
                        key={contact._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          background: darkMode ? "#052e16" : "#f0fdf4",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>⭐</span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#16a34a",
                          }}
                        >
                          {contact.contactName}
                        </span>
                        <button
                          onClick={() => onDelete(contact._id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#16a34a",
                            fontSize: "10px",
                            padding: "0 2px",
                            opacity: 0.6,
                          }}
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
