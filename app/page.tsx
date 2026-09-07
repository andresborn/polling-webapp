import { HowToBox } from "@/components/how-to-box";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-8">
      <main className="w-full py-8 px-18">
        <div className="w-fit border border-destructive/60 px-3 py-1 text-destructive font-heading mb-6 flex items-center gap-4">
          <span className="size-3 rounded-full bg-destructive animate-blink"></span>

          <p>live voting</p>
        </div>
        <h1 className="font-heading text-6xl bold">Ask a question.</h1>
        <h1 className="font-heading text-6xl text-primary bold pb-6">
          See the results in real time.
        </h1>
        <p className="font-sans text-muted-foreground">
          Pollit is a website where you can create polls, share them and see the
          results live. It's free and made by me. It runs on a cheap machine and
          comes with no guarantees. It's open source and it has an MIT License,
          so you can use it as you please.
        </p>
      </main>
      <div className="border-t border-primary/35"></div>
      <section className="w-full px-18">
        <span className="text-muted-foreground text-2xl">---</span>
        <h1 className="font-sans self-start text-xl text-primary pt-8">
          [ How it works ]
        </h1>
        <div className="flex justify-between gap-4 pt-12">
          <HowToBox
            title="01"
            subtitle="create"
            content="Write a question, add your options, and publish. Set an expiry date and choose whether voters need to sign in."
          />
          <HowToBox
            title="02"
            subtitle="publish"
            content="Every poll gets its own link, you can send it to anyone."
          />
          <HowToBox
            title="03"
            subtitle="watch the results"
            content="Votes are counted as they arrive and they are updated in real time for anyone with the link."
          />
        </div>
      </section>
      <footer className="h-8"></footer>
    </div>
  );
}
