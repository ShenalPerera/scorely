import { getAllSports } from '@/sports/registry'
import { Card, CardHeader, CardTitle, Pill, Divider } from '@/components/ui'

export default function DevSportsPage() {
  const sports = getAllSports()

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-display-lg text-text">Sport Registry</h1>
          <p className="text-body text-text-muted mt-1">
            {sports.length} sport{sports.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        <Divider />

        {sports.map((sport) => {
          const Icon = sport.icon
          return (
            <Card key={sport.id} className="p-5 flex flex-col gap-4">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3">
                  <span className="text-text-subtle [&>svg]:h-5 [&>svg]:w-5">
                    <Icon />
                  </span>
                  <CardTitle>{sport.name}</CardTitle>
                  <Pill variant={sport.status === 'active' ? 'success' : 'neutral'}>
                    {sport.status === 'active' ? 'Active' : 'Coming soon'}
                  </Pill>
                </div>
              </CardHeader>

              <div className="flex flex-col gap-1">
                <span className="text-label uppercase text-text-subtle">Formats</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {sport.formats.map((f) => (
                    <Pill key={f.id} variant="neutral">
                      {f.label}
                      {f.id === sport.defaultFormat && ' ✓'}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-label uppercase text-text-subtle">Plugin id</span>
                <code className="text-mono text-text-muted">{sport.id}</code>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
