import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-2xl font-semibold">Poll not found</h2>
      <p className="text-muted-foreground">
        This poll doesn&apos;t exist or may have been deleted.
      </p>
      <Link href="/" className="underline">
        Return home
      </Link>
    </div>
  );
}
