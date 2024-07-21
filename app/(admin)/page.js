"use client";

import { useRouter, redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage({}) {
  useEffect(() => {
    redirect("/auth/login");
  }, []);

  return <></>;
}
