"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 16px",
          border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          <div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: darkMode ? "#1e3a5f" : "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                marginBottom: "14px",
              }}
            >
              🔔
            </div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: darkMode ? "#f1f5f9" : "#0f172a",
                margin: "0 0 4px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: darkMode ? "#94a3b8" : "#475569",
                margin: 0,
              }}
            >
              Sign in to NotifManager
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
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

        {/* Form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div>
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
              EMAIL
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          <div>
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
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </motion.button>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: darkMode ? "#94a3b8" : "#475569",
            margin: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#3b82f6",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
