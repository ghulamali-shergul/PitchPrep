import Link from "next/link";
import Container from "@/components/ui/Container";
import TypewriterHeading from "@/components/domain/TypewriterHeading";

const features = [
  {
    icon: "🔍",
    title: "Company Research + Pitch Generator",
    description:
      "Enter a company name and get a personalized 30-sec pitch, key talking points with sources, top roles, smart questions, and a follow-up message.",
  },
  {
    icon: "📊",
    title: "Prioritize Companies",
    description:
      "Add multiple companies and get a ranked list with match scores, reasoning, and a recommended visit order. Filter by industry, location, and more.",
  },
  {
    icon: "🏷️",
    title: "Categorize & Organize",
    description:
      "Companies are automatically grouped by industry — Tech, Finance, Healthcare, Consulting — with badges showing match score and top roles.",
  },
];

const steps = [
    { number: "01", title: "Sign Up"},
  { number: "02", title: "Set Your Profile"},
  { number: "03", title: "See Career Fair Companies"},
  { number: "04", title: "Get Personalized Pitches"},
  { number: "05", title: "Get HIRED!"},
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-background to-blue-50 dark:to-slate-800 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🎯 Career Fair Prep Made Simple
            </div>
            <TypewriterHeading />
            <p className="mt-6 text-lg text-muted sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Research companies, craft personalized pitches, prioritize your visits, and polish your resume — all in one powerful workspace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
              >
                Start Prepping →
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-8 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                See Features
              </Link>
            </div>
          </div>
        </Container>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-lg text-muted">Five simple steps to career fair success</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="text-center step-pop-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-secondary">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Everything You Need</h2>
            <p className="mt-3 text-lg text-muted">Powerful tools to help you stand out</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to ace your career fair?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join thousands of students who walk into career fairs prepared and confident.
            </p>
            <Link
              href="/app"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              Get Started Free →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
