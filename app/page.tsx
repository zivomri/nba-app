"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"

interface NBATeam {
  tid: string
  city: string
  name: string
  abbr: string
  slug: string
  colors?: {
    primary: string
    secondary: string
  }
}

interface NBATeamsResponse {
  teams: NBATeam[]
}

function TeamCard({ team }: { team: NBATeam }) {
  return (
    <Link href={`/team/${team.tid}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 flex items-center justify-center bg-white border-2 border-border overflow-hidden">
              <img
                src={`https://cdn.nba.com/logos/nba/${team.tid}/primary/L/logo.svg`}
                alt={`${team.city} ${team.name} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    parent.style.backgroundColor = team.colors?.primary || "#1D428A"
                    parent.innerHTML = `<span class="text-white font-bold text-lg">${team.abbr}</span>`
                  }
                }}
              />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {team.city}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">{team.name}</p>
              <Badge variant="secondary" className="text-xs">
                {team.abbr}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function HomePage() {
  const [teams, setTeams] = useState<NBATeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log("[v0] Fetching NBA teams from internal API...")
        const response = await fetch("/api/teams")

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Teams data received:", data)

        if (data.teams && Array.isArray(data.teams)) {
          setTeams(data.teams)
        } else {
          throw new Error("Invalid teams data structure")
        }
      } catch (err) {
        console.error("[v0] Error fetching teams:", err)
        setError(err instanceof Error ? err.message : "Failed to load teams")
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading NBA teams...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading teams: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <img
                src="https://cdn.nba.com/manage/2022/10/nba-logo-primary.svg"
                alt="NBA Logo"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
              <h1 className="text-4xl font-bold text-foreground">NBA Teams</h1>
            </div>
            <p className="text-muted-foreground">Explore all {teams.length} NBA teams, players, and statistics</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">All NBA Teams</h2>
            <Badge variant="outline" className="text-sm">
              {teams.length} Teams
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.tid} team={team} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
