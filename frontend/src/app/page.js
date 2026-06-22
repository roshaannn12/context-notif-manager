"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Rules from "@/components/Rules";
import Analytics from "@/components/Analytics";
import AuthGuard from "@/components/AuthGuard";
import VipContacts from "@/components/VipContacts";
import CustomContextModal from "@/components/CustomContextModal";
import PushNotifications from "@/components/PushNotifications";
import AutoContext from "@/components/AutoContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "rules", label: "Rules", icon: "⚙️" },
  { id: "vip", label: "VIP", icon: "⭐" },
  { id: "push", label: "Notifications", icon: "🔔" },
  { id: "auto", label: "Auto", icon: "⏰" },
  { id: "analytics", label: "Analytics", icon: "📈" },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    appName: "Instagram",
    context: "Work",
    action: "mute",
  });
  const [rulesLoading, setRulesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [customContexts, setCustomContexts] = useState([]);
  const [showContextModal, setShowContextModal] = useState(false);
  const [vipContacts, setVipContacts] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }
      try {
        const res = await axios.get(
          "https://context-notif-manager-backend.onrender.com/api/auth/me",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const switchContext = async (context) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "https://context-notif-manager-backend.onrender.com/api/auth/context",
        { context },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser(res.data);
    } catch {
      setError("Failed to switch context!");
    }
  };

  const fetchRules = async (userId) => {
    setRulesLoading(true);
    try {
      const res = await axios.get(
        `https://context-notif-manager-backend.onrender.com/api/rules/${userId}`,
      );
      setRules(res.data);
    } catch {
      setError("Failed to fetch rules!");
    }
    setRulesLoading(false);
  };

  const addRule = async () => {
    setError(null);
    setDuplicateError(null);
    try {
      const res = await axios.post(
        "https://context-notif-manager-backend.onrender.com/api/rules",
        { userId: user._id, ...newRule },
      );
      if (res.data.updated) {
        setRules(
          rules.map((r) =>
            r.appName === res.data.appName && r.context === res.data.context
              ? res.data
              : r,
          ),
        );
      } else {
        setRules([...rules, res.data]);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setDuplicateError(err.response.data.message);
      } else {
        setError("Failed to add rule!");
      }
    }
  };

  const deleteRule = async (ruleId) => {
    try {
      await axios.delete(
        `https://context-notif-manager-backend.onrender.com/api/rules/${ruleId}`,
      );
      setRules(rules.filter((r) => r._id !== ruleId));
    } catch {
      setError("Failed to delete rule!");
    }
  };

  const fetchCustomContexts = async (userId) => {
    try {
      const res = await axios.get(
        `https://context-notif-manager-backend.onrender.com/api/contexts/${userId}`,
      );
      setCustomContexts(res.data);
    } catch {
      console.error("Failed to fetch custom contexts");
    }
  };

  const addCustomContext = async (contextData) => {
    try {
      const res = await axios.post(
        "https://context-notif-manager-backend.onrender.com/api/contexts",
        contextData,
      );
      setCustomContexts([...customContexts, res.data]);
      setShowContextModal(false);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create context!");
      }
    }
  };

  const deleteCustomContext = async (contextId) => {
    try {
      await axios.delete(
        `https://context-notif-manager-backend.onrender.com/api/contexts/${contextId}`,
      );
      setCustomContexts(customContexts.filter((c) => c._id !== contextId));
    } catch {
      setError("Failed to delete context!");
    }
  };

  const fetchVipContacts = async (userId) => {
    try {
      const res = await axios.get(
        `https://context-notif-manager-backend.onrender.com/api/vip/${userId}`,
      );
      setVipContacts(res.data);
    } catch {
      console.error("Failed to fetch VIP contacts");
    }
  };

  const addVipContact = async (contactData) => {
    try {
      const res = await axios.post(
        "https://context-notif-manager-backend.onrender.com/api/vip",
        { userId: user._id, ...contactData },
      );
      setVipContacts([...vipContacts, res.data]);
    } catch (err) {
      if (err.response?.status === 400) {
        return { error: err.response.data.message };
      }
      return { error: "Failed to add VIP contact!" };
    }
  };

  const deleteVipContact = async (contactId) => {
    try {
      await axios.delete(
        `https://context-notif-manager-backend.onrender.com/api/vip/${contactId}`,
      );
      setVipContacts(vipContacts.filter((c) => c._id !== contactId));
    } catch {
      setError("Failed to delete VIP contact!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    if (user) {
      fetchRules(user._id);
      fetchCustomContexts(user._id);
      fetchVipContacts(user._id);
    }
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "28px", marginBottom: "12px" }}>🔔</p>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            rules={rules}
            switchContext={switchContext}
            darkMode={darkMode}
            customContexts={customContexts}
            onAddContext={() => setShowContextModal(true)}
            onDeleteContext={deleteCustomContext}
          />
        );
      case "rules":
        return (
          <Rules
            rules={rules}
            newRule={newRule}
            setNewRule={setNewRule}
            addRule={addRule}
            deleteRule={deleteRule}
            rulesLoading={rulesLoading}
            darkMode={darkMode}
            duplicateError={duplicateError}
            setDuplicateError={setDuplicateError}
          />
        );
      case "vip":
        return (
          <VipContacts
            vipContacts={vipContacts}
            onAdd={addVipContact}
            onDelete={deleteVipContact}
            darkMode={darkMode}
          />
        );
      case "push":
        return <PushNotifications user={user} darkMode={darkMode} />;
      case "analytics":
        return <Analytics rules={rules} darkMode={darkMode} />;
      case "auto":
        return (
          <AutoContext
            user={user}
            switchContext={switchContext}
            darkMode={darkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "var(--bg-tertiary)",
          color: "var(--text-primary)",
          transition: "all 0.3s ease",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div className="desktop-sidebar" style={{ display: "flex" }}>
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={logout}
          />
        </div>

        <div className="main-content" style={{ flex: 1, overflowY: "auto" }}>
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                margin: "16px",
                borderRadius: "10px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ minHeight: "100vh", width: "100%" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="mobile-nav"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
            padding: "8px 0",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                padding: "6px 8px",
                borderRadius: "10px",
                border: "none",
                background: "transparent",
                color:
                  activeTab === item.id ? "var(--accent)" : "var(--text-muted)",
                fontSize: "9px",
                fontWeight: activeTab === item.id ? "600" : "400",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button
            onClick={logout}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "6px 8px",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "9px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            Logout
          </button>
        </div>

        {showContextModal && (
          <CustomContextModal
            userId={user?._id}
            onClose={() => setShowContextModal(false)}
            onAdd={addCustomContext}
            darkMode={darkMode}
          />
        )}
      </div>
    </AuthGuard>
  );
}
