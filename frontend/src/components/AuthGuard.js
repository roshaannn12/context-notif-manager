"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setChecking(false);
    } else {
      setAuthorized(true);
      setChecking(false);
    }
  }, []);

  if (checking) return null;
  if (!authorized) return null;

  return children;
}
