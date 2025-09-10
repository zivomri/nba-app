"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface NBAPlayer {
  id: string
  name: string
  firstName: string
  lastName: string
  displayName: string
  number: string
  position: string
  height: string
  weight: string
  age: number
  experience: number
  stats?: any
}

interface NBATeamRoster {
  league: {
    standard: {
      teamId: string
      players: NBAPlayer[]
    }
  }
}

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

function PlayerCard({ player, teamId }: { player: NBAPlayer; teamId: string }) {
  const fullName = player.displayName || `${player.firstName} ${player.lastName}` || player.name

  return (
    <Link href={`/player/${teamId}/${player.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Player Avatar */}
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {player.number ? `#${player.number}` : ""}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {fullName}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {player.position || "N/A"}
                </Badge>
                <span>{player.height || "N/A"}</span>
                <span>{player.weight || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <span>Age: {player.age || "N/A"}</span>
                <span>Exp: {player.experience || 0} yrs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const teamId = params.teamId
  const [teamInfo, setTeamInfo] = useState<NBATeam | null>(null)
  const [roster, setRoster] = useState<NBAPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        console.log("[v0] Fetching team info and roster for team:", teamId)

        const response = await fetch(`/api/teams/${teamId}/roster`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error(`Failed to fetch team data: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Team data received:", data)

        if (data.team && data.roster) {
          setTeamInfo(data.team)
          setRoster(data.roster)
        } else {
          throw new Error("Invalid team data structure")
        }
      } catch (err) {
        console.error("[v0] Error fetching team data:", err)
        setError(err instanceof Error ? err.message : "Failed to load team data")
        setTeamInfo({
          tid: teamId,
          city: "Sample City",
          name: "Team",
          abbr: "SAM",
          slug: "sample-team",
        })
        setRoster([
          {
            id: "1",
            name: "Sample Player 1",
            firstName: "Sample",
            lastName: "Player 1",
            displayName: "Sample Player 1",
            number: "1",
            position: "PG",
            height: "6'2\"",
            weight: "190 lbs",
            age: 25,
            experience: 3,
          },
          {
            id: "2",
            name: "Sample Player 2",
            firstName: "Sample",
            lastName: "Player 2",
            displayName: "Sample Player 2",
            number: "2",
            position: "SG",
            height: "6'4\"",
            weight: "200 lbs",
            age: 27,
            experience: 5,
          },
        ] as NBAPlayer[])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [teamId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    )
  }

  if (!teamInfo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Teams
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border-2 border-border overflow-hidden">
              <img
                src={`https://cdn.nba.com/logos/nba/${teamInfo.tid}/primary/L/logo.svg`}
                alt={`${teamInfo.city} ${teamInfo.name} logo`}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    parent.style.backgroundColor = teamInfo.colors?.primary || "#1D428A"
                    parent.innerHTML = `<span class="text-white font-bold text-2xl">${teamInfo.abbr}</span>`
                  }
                }}
              />
            </div>

            {/* Team Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {teamInfo.city} {teamInfo.name}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <Badge variant="secondary">{teamInfo.abbr}</Badge>
                <span className="text-sm">Official Roster</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Team Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{roster.length}</p>
                  <p className="text-sm text-muted-foreground">Active Players</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">NBA</p>
                  <p className="text-sm text-muted-foreground">League</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">2024-25</p>
                  <p className="text-sm text-muted-foreground">Season</p>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">Note: Using sample data due to API limitations. {error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Players Roster */}
          <Card>
            <CardHeader>
              <CardTitle>Current Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {roster
                  .sort((a, b) => {
                    // Players without numbers go to the end
                    if (!a.number && !b.number) return 0
                    if (!a.number) return 1
                    if (!b.number) return -1

                    // Sort players with numbers numerically
                    return Number.parseInt(a.number) - Number.parseInt(b.number)
                  })
                  .map((player) => (
                    <PlayerCard key={player.id} player={player} teamId={teamId} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
