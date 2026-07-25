import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const contacts = [
  {
    label: "Email",
    value: "dck.alx@gmail.com",
    href: "mailto:dck.alx@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "Dongckim",
    href: "https://github.com/Dongckim",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "dongckim99",
    href: "https://www.linkedin.com/in/dongckim99/",
    icon: Linkedin,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-textPrimary">Contact</h1>
        <div className="mt-5 h-1 w-20 rounded-full bg-textPrimary" />

        <p className="mt-12 text-xl md:text-2xl leading-relaxed text-textSecondary">
          Feel free to reach out through any of the following channels.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map(({ label, value, href, icon: Icon }) => {
            const external = href.startsWith("http");

            return (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex min-h-36 items-center gap-6 rounded-2xl border border-border bg-surface px-8 py-6 shadow-[0_12px_28px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.1)]"
              >
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-muted text-textPrimary transition-colors duration-300 group-hover:bg-textPrimary group-hover:text-background">
                  <Icon className="h-7 w-7" strokeWidth={2.25} />
                </span>
                <span className="min-w-0">
                  <span className="block text-2xl font-semibold tracking-[-0.04em] text-textPrimary">{label}</span>
                  <span className="mt-1 block truncate text-base md:text-lg text-textSecondary">{value}</span>
                </span>
              </a>
            );
          })}
        </div>

        <section className="mt-20 border-t border-border pt-10">
          <p className="text-center text-xl md:text-2xl text-textSecondary">Feel free to check my availability.</p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[0_12px_28px_rgba(0,0,0,0.05)] md:p-4">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=dongchankim1999%40gmail.com&ctz=Asia%2FSeoul"
              title="Dongchan Kim's calendar"
              className="h-[600px] w-full rounded-xl"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </section>

        <div className="mt-16 text-center">
          <p className="text-lg text-textSecondary">I&apos;m always happy to connect about AI, XR, and the next interface.</p>
          <Link
            href="mailto:dck.alx@gmail.com"
            className="mt-6 inline-flex rounded-full bg-textPrimary px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            Send an email
          </Link>
        </div>
      </section>
    </main>
  );
}
