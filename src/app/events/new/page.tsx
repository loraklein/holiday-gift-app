"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/events?action=add");
  }, [router]);

  return null;
} 