import BentoGrid from "@/components/BentoGrid";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-textSecondary">Selected work</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-textPrimary">Projects.</h1>
        <div className="mt-5 h-1 w-20 rounded-full bg-textPrimary" />
        <p className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-textSecondary">
          A selection of real-time, spatial, and AI-enabled products I&apos;ve built with teams and on my own.
        </p>
        <div className="mt-12">
          <BentoGrid />
        </div>
      </section>
    </main>
  );
}
