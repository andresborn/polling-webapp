"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const NavAuth = () => {
  const { useSession, signOut } = authClient;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data, error, isPending } = useSession();
  const router = useRouter();

  const handleButton = async () => {
    if (data) {
      const { error } = await signOut();
      if (error) console.error({ error });
      router.push("/");
    } else {
      router.push("/sign-in");
    }
  };

  if (isPending) return null;

  return (
    <>
      <Button onClick={handleButton}>{data ? "Sign Out" : "Sign In"}</Button>
    </>
  );
};
