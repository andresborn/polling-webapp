"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const NavAuth = () => {
  const { useSession, signOut } = authClient;

  const { data, isPending } = useSession();
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

  const navigateToDashboard = () => router.push("/dashboard");

  if (isPending) return null;

  return (
    <div className="flex gap-4">
      {data && (
        <Button
          className="font-heading"
          variant="secondary"
          size="lg"
          onClick={navigateToDashboard}
        >
          Your polls
        </Button>
      )}
      <Button
        className="font-heading"
        variant="default"
        size="lg"
        onClick={handleButton}
      >
        {data ? "Sign Out" : "Sign In"}
      </Button>
    </div>
  );
};
