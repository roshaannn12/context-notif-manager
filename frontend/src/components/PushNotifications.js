"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = "https://context-notif-manager-backend.onrender.com";

export default function PushNotifications({ user, darkMode }) {
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [vapidKey, setVapidKey] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
      fetchVapidKey();
      checkExistingSubscription();
    }
  }, []);

  const fetchVapidKey = async () => {
    try {
      const res = await axios.get(`${API}/api/push/vapid-public-key`);
      setVapidKey(res.data.publicKey);
    } catch {
      console.error("Failed to fetch VAPID key");
    }
  };

  const checkExistingSubscription = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (sub) setSubscribed(true);
      }
    } catch {
      console.error("Failed to check subscription");
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const enableNotifications = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setMessage({
          type: "error",
          text: "Permission denied! Please allow notifications in browser settings.",
        });
        setLoading(false);
        return;
      }

      // Subscribe to push
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // Save subscription to backend
      await axios.post(`${API}/api/push/subscribe`, {
        userId: user._id,
        subscription: sub,
      });

      setSubscribed(true);
      setMessage({
        type: "success",
        text: "Push notifications enabled successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to enable notifications: " + error.message,
      });
    }
    setLoading(false);
  };

  const sendTestNotification = async () => {
    setTestLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API}/api/push/test`, { userId: user._id });
      setMessage({
        type: "success",
        text: "Test notification sent! Check your notifications.",
      });
    } catch {
      setMessage({ type: "error", text: "Failed to send test notification!" });
    }
    setTestLoading(false);
  };

  const sendFilteredNotification = async (appName, notifMessage) => {
    try {
      const res = await axios.post(`${API}/api/push/send`, {
        userId: user._id,
        appName,
        message: notifMessage,
      });
      setMessage({ type: "success", text: `${appName}: ${res.data.action}!` });
    } catch {
      setMessage({ type: "error", text: "Failed to send notification!" });
    }
  };

  const DEMO_NOTIFICATIONS = [
    { app: "Instagram", message: "John liked your photo" },
    { app: "Gmail", message: "New email from your manager" },
    { app: "Slack", message: "Team standup in 5 minutes" },
    { app: "WhatsApp", message: "Mom: Are you coming home?" },
  ];

  return (
    <div
      style={{
        padding: "clamp(16px, 4vw, 32px)",
        flex: 1,
        overflowY: "auto",
        minHeight: "100vh",
      }}
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
          Push Notifications
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Enable real browser notifications filtered by your rules
        </p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: message.type === "success" ? "#16a34a" : "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          {message.text}
        </motion.div>
      )}

      {/* Status Card */}
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
          NOTIFICATION STATUS
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              label: "Browser Permission",
              value: permission,
              ok: permission === "granted",
            },
            {
              label: "Push Subscription",
              value: subscribed ? "Active" : "Not subscribed",
              ok: subscribed,
            },
            {
              label: "Service Worker",
              value:
                "serviceWorker" in navigator ? "Supported" : "Not supported",
              ok: "serviceWorker" in navigator,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "13px", color: "var(--text-secondary)" }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: item.ok ? "#f0fdf4" : "#fef2f2",
                  color: item.ok ? "#16a34a" : "#dc2626",
                  border: `1px solid ${item.ok ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Enable Button */}
      {!subscribed ? (
        <motion.button
          onClick={enableNotifications}
          disabled={loading || !vapidKey}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {loading ? "Enabling..." : "🔔 Enable Push Notifications"}
        </motion.button>
      ) : (
        <motion.button
          onClick={sendTestNotification}
          disabled={testLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {testLoading ? "Sending..." : "🧪 Send Test Notification"}
        </motion.button>
      )}

      {/* Demo Notifications */}
      {subscribed && (
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
            SEND FILTERED NOTIFICATION
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "14px",
            }}
          >
            These will be filtered by your current rules — muted apps won't
            show!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {DEMO_NOTIFICATIONS.map((notif) => (
              <motion.button
                key={notif.app}
                onClick={() =>
                  sendFilteredNotification(notif.app, notif.message)
                }
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                }}
              >
                <span>
                  {notif.app}: {notif.message}
                </span>
                <span style={{ fontSize: "11px", color: "var(--accent)" }}>
                  Send →
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
