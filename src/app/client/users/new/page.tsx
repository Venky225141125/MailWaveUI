"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

/** Legacy route — create flow now lives in a drawer on the users list. */
export default function CreateUserRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.client.users);
  }, [router]);

  return (
    <p className="text-sm text-muted-foreground">Opening users…</p>
  );
}
