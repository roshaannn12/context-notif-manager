"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Rules from "@/components/Rules";
import Analytics from "@/components/Analytics";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    appName: "Instagram",
    context: "Work",
    action: "mute",
  });
  const [rulesLoading, setRulesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const createUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/users", {
        name: "Roshan",
        email: "roshan@test.com",
      });
      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 400) {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/users/by-email/roshan@test.com",
          );
          setUser(res.data);
        } catch {
          setError("Could not load profile!");
        }
      } else {
        setError("Something went wrong!");
      }
    }
    setLoading(false);
  };

  const switchContext = async (context) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}/context`,
        { context },
      );
      setUser(res.data);
    } catch {
      setError("Failed to switch context!");
    }
  };

  const fetchRules = async (userId) => {
    setRulesLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/rules/${userId}`);
      setRules(res.data);
    } catch {
      setError("Failed to fetch rules!");
    }
    setRulesLoading(false);
  };

  const addRule = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/rules", {
        userId: user._id,
        ...newRule,
      });
      setRules([...rules, res.data]);
    } catch {
      setError("Failed to add rule!");
    }
  };

  const deleteRule = async (ruleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/rules/${ruleId}`);
      setRules(rules.filter((r) => r._id !== ruleId));
    } catch {
      setError("Failed to delete rule!");
    }
  };

  useEffect(() => {
    if (user) fetchRules(user._id);
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-tertiary)",
        color: "var(--text-primary)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {!user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "var(--bg-card)",
                borderRadius: "20px",
                padding: "48px 40px",
                textAlign: "center",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
                maxWidth: "400px",
                width: "100%",
                margin: "0 32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "var(--accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 20px",
                }}
              >
                🔔
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                }}
              >
                Welcome to NotifManager
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  margin: "0 0 28px",
                  lineHeight: "1.6",
                }}
              >
                Take control of your notifications based on what you're doing
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
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <motion.button
                onClick={createUser}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                {loading ? "Loading..." : "Get Started →"}
              </motion.button>

              {/* Theme toggle on landing */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  marginTop: "16px",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
              </button>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                style={{ height: "100%" }}
              >
                <Dashboard
                  user={user}
                  rules={rules}
                  switchContext={switchContext}
                  darkMode={darkMode}
                />
              </motion.div>
            )}
            {activeTab === "rules" && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                style={{ height: "100%" }}
              >
                <Rules
                  rules={rules}
                  newRule={newRule}
                  setNewRule={setNewRule}
                  addRule={addRule}
                  deleteRule={deleteRule}
                  rulesLoading={rulesLoading}
                  darkMode={darkMode}
                />
              </motion.div>
            )}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                style={{ height: "100%" }}
              >
                <Analytics rules={rules} darkMode={darkMode} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
