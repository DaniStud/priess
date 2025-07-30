
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/business/logout", { method: "POST", credentials: "include" })
      .finally(() => {
        router.replace("/");
      });
  }, [router]);
  return null;
}
