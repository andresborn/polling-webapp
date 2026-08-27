import { SignInCard } from "@/components/signin-card";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center">
      <main className="w-full max-w-sm py-32">
        <SignInCard />
      </main>
    </div>
  );
}
