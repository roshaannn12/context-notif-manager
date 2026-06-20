"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
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
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
