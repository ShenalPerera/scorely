import Link from "next/link";
import { AppShell, TopNav, Container, Section } from "@/components/shell";
import { Button, Pill, LiveDot } from "@/components/ui";

export default function HomePage() {
  return (
    <AppShell nav={<TopNav />}>
      <Container>
        <Section spacing="lg">
          <div className="flex flex-col items-start gap-6">
            <Pill variant="live" size="lg">
              <LiveDot /> Foundations checkpoint
            </Pill>
            <h1 className="text-display-xl text-text">
              Scorely is being built.
            </h1>
            <p className="max-w-2xl text-body-lg text-text-muted">
              The design system is ready for review. Pages haven't been built yet — they
              will compose from the primitives shown in the components library.
            </p>
            <Link href="/_dev/components">
              <Button variant="primary" size="lg">
                Review the components library →
              </Button>
            </Link>
          </div>
        </Section>
      </Container>
    </AppShell>
  );
}
