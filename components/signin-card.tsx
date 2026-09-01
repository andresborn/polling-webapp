"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignInCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authClient.signIn.email({ email, password });

    if (res.error === null) {
      router.push("/dashboard");
    }

    // set error
  };

  return (
    <div className="flex flex-col px-2 py-4 gap-4">
      <div className="font-heading self-center text-2xl">Sign In</div>
      <form onSubmit={handleSignIn}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="johnnymnemonic@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder=""
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Field>
          <Button type="submit">Sign In</Button>
        </FieldGroup>
      </form>
      <p className="font-extralight text-sm">
        If you don't have an account{" "}
        <Link className="underline" href="/sign-up">
          sign up
        </Link>
        .
      </p>
    </div>
  );
};
