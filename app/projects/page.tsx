import ProjectLineupPreview from "@/components/ProjectLineupPreview";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-textSecondary">Selected work</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-textPrimary md:text-7xl">
          Built with the system in mind.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-textSecondary md:text-xl">
          A product-first presentation for real-time, spatial, and AI-enabled work. Each project leads with its experience, then quietly exposes the architecture underneath.
        </p>
        <div className="mt-12 md:mt-16">
          <ProjectLineupPreview />
        </div>
      </section>
    </main>
  );
}
