import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectLineupPreview from "@/components/ProjectLineupPreview";

export default function ProjectPreviewPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36">
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-32 lg:px-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-textSecondary transition-colors hover:text-textPrimary">
          <ArrowLeft className="h-4 w-4" /> Back to current projects
        </Link>
        <p className="mt-12 text-sm font-medium uppercase tracking-[0.16em] text-textSecondary">Preview · Project lineup</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-textPrimary md:text-7xl">
          Built with the system in mind.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-textSecondary md:text-xl">
          A product-first presentation for technical work. Each project leads with its experience, then quietly exposes the architecture that makes it possible.
        </p>
        <div className="mt-12 md:mt-16">
          <ProjectLineupPreview />
        </div>
      </section>
    </main>
  );
}
