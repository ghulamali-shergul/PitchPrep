import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 mt-auto">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white font-bold text-xs">
              PP
            </div>
            <span className="text-sm font-semibold text-foreground">PitchPrep</span>
          </div>
          <p className="text-sm text-muted">
            Ace your career fair — one pitch at a time.
          </p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} PitchPrep. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
