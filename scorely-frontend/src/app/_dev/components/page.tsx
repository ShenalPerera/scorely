"use client";

import { useState } from "react";
import { Plus, Search, ArrowRight, Trophy, Calendar } from "lucide-react";
import {
  AppShell,
  TopNav,
  Container,
  Section,
  PageHeader,
} from "@/components/shell";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Divider,
  EmptyState,
  IconButton,
  Input,
  Notice,
  Pill,
  LiveDot,
  Segmented,
  Skeleton,
  Stat,
} from "@/components/ui";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMPONENTS LIBRARY
   The single source of truth for what every primitive looks like.
   Toggle theme using the button in the top nav to verify both modes.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Demo({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-b-0 py-8 first:pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div>
          <h3 className="text-body-lg font-semibold text-text">{title}</h3>
          {description && (
            <p className="mt-1 text-body-sm text-text-muted">{description}</p>
          )}
        </div>
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

function Row({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-label uppercase text-text-subtle font-mono">{label}</span>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function ComponentsLibraryPage() {
  const [format, setFormat] = useState<"T20" | "ODI" | "TEST">("T20");
  const [sport, setSport] = useState<"cricket" | "football" | "basketball">("cricket");

  return (
    <AppShell nav={<TopNav />}>
      <Container width="lg">
        <Section spacing="md">
          <PageHeader
            eyebrow="Foundation review"
            title="Components library"
            description="Every primitive, every variant, both themes. Toggle the theme in the top nav. Approve before pages get built."
            actions={
              <Pill variant="warning" size="lg">
                Internal · /_dev/components
              </Pill>
            }
          />
        </Section>

        <Section spacing="md">
          <div className="rounded-lg border border-border bg-surface">
            <div className="px-6">
              {/* ━━━ Typography ━━━ */}
              <Demo
                title="Typography"
                description="Sans throughout (Geist). Mono for stats and labels (Geist Mono). Tabular figures for any numeric display."
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Display XL · 88px
                    </span>
                    <h1 className="text-display-xl text-text">Live scoring.</h1>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Display LG · 56px
                    </span>
                    <h2 className="text-display-lg text-text">India vs Australia</h2>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Score XL · tabular
                    </span>
                    <p className="text-score-xl tabular text-text">
                      142<span className="text-text-subtle">/</span>3
                    </p>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Display MD · 40px
                    </span>
                    <h3 className="text-display-md text-text">Your matches</h3>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Body LG · 18px
                    </span>
                    <p className="text-body-lg text-text">
                      Score every ball, every point, every match.
                    </p>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Body · 15px
                    </span>
                    <p className="text-body text-text-muted">
                      Spectators watch in real time. Scorers tap. The score updates everywhere within 200 milliseconds.
                    </p>
                  </div>
                  <div>
                    <span className="text-label uppercase text-text-subtle font-mono">
                      Mono · 13px
                    </span>
                    <p className="text-mono font-mono text-text-muted">
                      INNINGS 1 · 16.4 OVERS · RUN RATE 8.65
                    </p>
                  </div>
                </div>
              </Demo>

              {/* ━━━ Color tokens ━━━ */}
              <Demo
                title="Color tokens"
                description="Semantic tokens only. Pages reference these by name (bg-surface, text-accent), never raw hex."
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "bg", className: "bg-bg" },
                    { name: "surface", className: "bg-surface" },
                    { name: "surface-elevated", className: "bg-surface-elevated" },
                    { name: "surface-overlay", className: "bg-surface-overlay" },
                    { name: "border", className: "bg-border" },
                    { name: "border-strong", className: "bg-border-strong" },
                    { name: "text", className: "bg-text" },
                    { name: "text-muted", className: "bg-text-muted" },
                    { name: "accent", className: "bg-accent" },
                    { name: "accent-soft", className: "bg-accent-soft" },
                    { name: "success", className: "bg-success" },
                    { name: "warning", className: "bg-warning" },
                    { name: "danger", className: "bg-danger" },
                    { name: "info", className: "bg-info" },
                  ].map((c) => (
                    <div key={c.name} className="flex flex-col gap-1.5">
                      <div
                        className={`h-12 rounded-md border border-border ${c.className}`}
                      />
                      <span className="text-label uppercase font-mono text-text-muted">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Demo>

              {/* ━━━ Buttons ━━━ */}
              <Demo
                title="Buttons"
                description="Primary, secondary, ghost, danger, outline. Three sizes."
              >
                <Row label="Primary — used for the main action on a page">
                  <Button variant="primary" size="sm">Sign in</Button>
                  <Button variant="primary" size="md">Sign in</Button>
                  <Button variant="primary" size="lg">Sign in</Button>
                </Row>
                <Row label="Secondary — used for adjacent actions">
                  <Button variant="secondary" size="sm">View match</Button>
                  <Button variant="secondary" size="md">View match</Button>
                  <Button variant="secondary" size="lg">View match</Button>
                </Row>
                <Row label="Ghost — used for tertiary actions and toolbars">
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button variant="ghost" size="md">Cancel</Button>
                  <Button variant="ghost" size="lg">Cancel</Button>
                </Row>
                <Row label="Danger — destructive actions">
                  <Button variant="danger" size="md">Delete match</Button>
                </Row>
                <Row label="With icons">
                  <Button variant="primary"><Plus className="h-4 w-4" /> New match</Button>
                  <Button variant="secondary">View live <ArrowRight className="h-4 w-4" /></Button>
                </Row>
                <Row label="States">
                  <Button variant="primary">Enabled</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" block>Block (full-width)</Button>
                </Row>
              </Demo>

              {/* ━━━ Icon buttons ━━━ */}
              <Demo title="Icon buttons" description="Square buttons for icon-only actions.">
                <Row>
                  <IconButton variant="primary" aria-label="Add"><Plus /></IconButton>
                  <IconButton variant="secondary" aria-label="Search"><Search /></IconButton>
                  <IconButton variant="ghost" aria-label="Trophy"><Trophy /></IconButton>
                  <IconButton size="sm" variant="secondary" aria-label="Add"><Plus /></IconButton>
                  <IconButton size="lg" variant="secondary" aria-label="Add"><Plus /></IconButton>
                </Row>
              </Demo>

              {/* ━━━ Pills ━━━ */}
              <Demo
                title="Pills & status"
                description="Status indicators. Live pills include a pulsing dot."
              >
                <Row>
                  <Pill variant="live"><LiveDot /> Live</Pill>
                  <Pill variant="upcoming">Upcoming</Pill>
                  <Pill variant="completed">Final</Pill>
                  <Pill variant="neutral">T20</Pill>
                  <Pill variant="accent">New</Pill>
                  <Pill variant="success">Synced</Pill>
                  <Pill variant="warning">Offline</Pill>
                  <Pill variant="danger">Failed</Pill>
                </Row>
                <Row label="Sizes">
                  <Pill variant="live" size="sm"><LiveDot /> Live</Pill>
                  <Pill variant="live" size="md"><LiveDot /> Live</Pill>
                  <Pill variant="live" size="lg"><LiveDot /> Live</Pill>
                </Row>
              </Demo>

              {/* ━━━ Inputs ━━━ */}
              <Demo title="Inputs" description="Text input with built-in label, hint, and error.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <Input label="Team A" placeholder="e.g. India" />
                  <Input label="Team B" placeholder="e.g. Australia" defaultValue="Australia" />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    leadingIcon={<Search />}
                  />
                  <Input
                    label="Password"
                    type="password"
                    hint="At least 8 characters"
                  />
                  <Input
                    label="Match code"
                    placeholder="ABC-123"
                    error="That code doesn't exist."
                  />
                </div>
              </Demo>

              {/* ━━━ Segmented ━━━ */}
              <Demo
                title="Segmented control"
                description="Single-select between 2-5 options. Used for sport pickers, format selectors, theme controls."
              >
                <Row label="Format">
                  <Segmented
                    value={format}
                    onChange={setFormat}
                    options={[
                      { value: "T20", label: "T20" },
                      { value: "ODI", label: "ODI" },
                      { value: "TEST", label: "Test" },
                    ]}
                  />
                </Row>
                <Row label="Sport">
                  <Segmented
                    value={sport}
                    onChange={setSport}
                    options={[
                      { value: "cricket", label: "Cricket" },
                      { value: "football", label: "Football" },
                      { value: "basketball", label: "Basketball", disabled: true },
                    ]}
                  />
                </Row>
                <Row label="Block (full-width)">
                  <Segmented
                    block
                    size="lg"
                    value={format}
                    onChange={setFormat}
                    options={[
                      { value: "T20", label: "T20" },
                      { value: "ODI", label: "ODI" },
                      { value: "TEST", label: "Test" },
                    ]}
                  />
                </Row>
              </Demo>

              {/* ━━━ Cards ━━━ */}
              <Demo title="Cards" description="Wrap content with surface, border, radius. Interactive variant lifts on hover.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <p className="text-body-sm text-text-muted">Default card</p>
                    <p className="text-body text-text mt-1">Static surface for content.</p>
                  </Card>
                  <Card interactive>
                    <p className="text-body-sm text-text-muted">Interactive card</p>
                    <p className="text-body text-text mt-1">Hover to see the lift.</p>
                  </Card>
                  <Card tone="accent">
                    <p className="text-body-sm text-accent">Accent tone</p>
                    <p className="text-body text-text mt-1">Highlighted card.</p>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Pill variant="neutral">T20</Pill>
                      <Pill variant="live"><LiveDot />Live</Pill>
                    </div>
                    <Pill variant="neutral" size="sm">Owner</Pill>
                  </CardHeader>
                  <CardTitle>India vs Australia</CardTitle>
                  <p className="mt-1 text-mono font-mono text-text-muted">
                    142/3 · 16.4 OVERS · RR 8.65
                  </p>
                </Card>
              </Demo>

              {/* ━━━ Stat ━━━ */}
              <Demo
                title="Stat"
                description="Label + numeric value. The score hero on every spectator screen is built from these."
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Stat label="Score" value="142/3" size="score-lg" />
                  <Stat label="Overs" value="16.4" size="lg" />
                  <Stat label="Run rate" value="8.65" size="lg" align="right" />
                </div>

                <div className="rounded-lg border border-border bg-bg p-6">
                  <Stat
                    label="India · Innings 1"
                    value={
                      <>
                        142<span className="text-text-subtle font-normal">/</span>3
                      </>
                    }
                    size="score-xl"
                    accent
                  />
                </div>
              </Demo>

              {/* ━━━ Avatars ━━━ */}
              <Demo title="Avatars" description="User initials, three sizes.">
                <Row>
                  <Avatar name="Ravi Sharma" size="sm" />
                  <Avatar name="Ravi Sharma" size="md" />
                  <Avatar name="Ravi Sharma" size="lg" />
                  <Avatar name="Aisha Patel" size="md" />
                  <Avatar name="Marcus" size="md" />
                </Row>
              </Demo>

              {/* ━━━ Notices ━━━ */}
              <Demo title="Notices" description="Inline messages: info, warning, danger, success.">
                <div className="flex flex-col gap-3 max-w-2xl">
                  <Notice tone="info" title="Heads up">
                    Your match link is public. Anyone with the URL can watch.
                  </Notice>
                  <Notice tone="warning" title="You're offline">
                    Your taps are being saved locally. They'll sync when you reconnect.
                  </Notice>
                  <Notice tone="danger" title="Couldn't sign you in">
                    The email or password didn't match.
                  </Notice>
                  <Notice tone="success">First ball logged successfully.</Notice>
                </div>
              </Demo>

              {/* ━━━ Empty states ━━━ */}
              <Demo title="Empty states" description="Used when there's no content yet, or content is filtered to nothing.">
                <EmptyState
                  icon={<Trophy />}
                  title="No matches yet"
                  description="Your dashboard will fill up as you create matches or get assigned as a scorer."
                  action={<Button variant="primary"><Plus className="h-4 w-4" /> Create your first match</Button>}
                />
                <EmptyState
                  icon={<Calendar />}
                  title="Match hasn't started"
                  description="India vs Australia begins at 7:30 PM. The score will appear here automatically."
                />
              </Demo>

              {/* ━━━ Skeletons ━━━ */}
              <Demo title="Skeletons" description="Loading placeholders. Match the shape of the content they're replacing.">
                <div className="flex flex-col gap-3 max-w-md">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-64" />
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </div>
              </Demo>

              {/* ━━━ Dividers ━━━ */}
              <Demo title="Dividers" description="Horizontal separator with optional label.">
                <div className="flex flex-col gap-4 max-w-md">
                  <Divider />
                  <Divider label="OR EMAIL" />
                </div>
              </Demo>
            </div>
          </div>
        </Section>

        <Section spacing="md">
          <Notice tone="info" title="Pages haven't been built yet">
            This page is the foundation checkpoint. Once approved, every page will be composed from
            these primitives — no new styling, no inline classes, full consistency by construction.
          </Notice>
        </Section>
      </Container>
    </AppShell>
  );
}
