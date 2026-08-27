"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignUpCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authClient.signUp.email({ email, password, name });
    if (!res.error) {
      router.push("/dashboard");
    }
    // set error
  };

  return (
    <div className="flex flex-col px-2 py-4 gap-4">
      <div className="font-heading self-center text-2xl">Sign Up</div>
      <form onSubmit={handleSignUp}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Johnny Mnemonic"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Field>

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
          <Button type="submit">Sign Up</Button>
        </FieldGroup>
      </form>
      <p className="font-extralight text-sm">
        If you already have an account{" "}
        <Link className="underline" href="/sign-in">
          sign in
        </Link>
        .
      </p>
    </div>
  );
};
