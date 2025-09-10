"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Player statistics data
const playerStats = {
  celtics: {
    tatum: {
      id: "tatum",
      name: "Jayson Tatum",
      position: "SF",
      number: 0,
      height: "6'8\"",
      weight: "210 lbs",
      age: 25,
      experience: 7,
      college: "Duke",
      stats: {
        season: "2023-24",
        gamesPlayed: 74,
        minutesPerGame: 36.9,
        pointsPerGame: 26.9,
        reboundsPerGame: 8.1,
        assistsPerGame: 4.9,
        stealsPerGame: 1.0,
        blocksPerGame: 0.6,
        fieldGoalPercentage: 47.1,
        threePointPercentage: 37.6,
        freeThrowPercentage: 83.3,
      },
      careerHighs: {
        points: 60,
        rebounds: 16,
        assists: 12,
      },
    },
    brown: {
      id: "brown",
      name: "Jaylen Brown",
      position: "SG",
      number: 7,
      height: "6'6\"",
      weight: "223 lbs",
      age: 27,
      experience: 8,
      college: "Georgia",
      stats: {
        season: "2023-24",
        gamesPlayed: 70,
        minutesPerGame: 35.4,
        pointsPerGame: 23.0,
        reboundsPerGame: 5.5,
        assistsPerGame: 3.6,
        stealsPerGame: 1.2,
        blocksPerGame: 0.4,
        fieldGoalPercentage: 49.9,
        threePointPercentage: 35.4,
        freeThrowPercentage: 70.3,
      },
      careerHighs: {
        points: 50,
        rebounds: 13,
        assists: 11,
      },
    },
  },
  lakers: {
    james: {
      id: "james",
      name: "LeBron James",
      position: "SF",
      number: 23,
      height: "6'9\"",
      weight: "250 lbs",
      age: 39,
      experience: 21,
      college: "None (High School)",
      stats: {
        season: "2023-24",
        gamesPlayed: 71,
        minutesPerGame: 35.3,
        pointsPerGame: 25.7,
        reboundsPerGame: 7.3,
        assistsPerGame: 8.3,
        stealsPerGame: 1.3,
        blocksPerGame: 0.5,
        fieldGoalPercentage: 54.0,
        threePointPercentage: 41.0,
        freeThrowPercentage: 75.0,
      },
      careerHighs: {
        points: 61,
        rebounds: 19,
        assists: 19,
      },
    },
    davis: {
      id: "davis",
      name: "Anthony Davis",
      position: "PF",
      number: 3,
      height: "6'10\"",
      weight: "253 lbs",
      age: 31,
      experience: 12,
      college: "Kentucky",
      stats: {
        season: "2023-24",
        gamesPlayed: 76,
        minutesPerGame: 35.5,
        pointsPerGame: 24.7,
        reboundsPerGame: 12.6,
        assistsPerGame: 3.5,
        stealsPerGame: 1.2,
        blocksPerGame: 2.3,
        fieldGoalPercentage: 55.6,
        threePointPercentage: 27.1,
        freeThrowPercentage: 81.6,
      },
      careerHighs: {
        points: 59,
        rebounds: 20,
        assists: 9,
      },
    },
  },
  warriors: {
    curry: {
      id: "curry",
      name: "Stephen Curry",
      position: "PG",
      number: 30,
      height: "6'2\"",
      weight: "185 lbs",
      age: 35,
      experience: 15,
      college: "Davidson",
      stats: {
        season: "2023-24",
        gamesPlayed: 74,
        minutesPerGame: 32.7,
        pointsPerGame: 26.4,
        reboundsPerGame: 4.5,
        assistsPerGame: 5.1,
        stealsPerGame: 0.9,
        blocksPerGame: 0.4,
        fieldGoalPercentage: 45.0,
        threePointPercentage: 40.8,
        freeThrowPercentage: 91.5,
      },
      careerHighs: {
        points: 62,
        rebounds: 16,
        assists: 16,
      },
    },
  },
}

// Default player stats for players without detailed data
const defaultPlayerStats = {
  stats: {
    season: "2023-24",
    gamesPlayed: 65,
    minutesPerGame: 28.5,
    pointsPerGame: 15.2,
    reboundsPerGame: 6.8,
    assistsPerGame: 3.4,
    stealsPerGame: 1.1,
    blocksPerGame: 0.8,
    fieldGoalPercentage: 45.2,
    threePointPercentage: 35.8,
    freeThrowPercentage: 78.5,
  },
  careerHighs: {
    points: 35,
    rebounds: 15,
    assists: 10,
  },
  age: 26,
  experience: 4,
  college: "University",
}

// Team colors for styling
const teamColors = {
  celtics: ["#007A33", "#BA9653"],
  lakers: ["#552583", "#FDB927"],
  warriors: ["#1D428A", "#FFC72C"],
}

function StatCard({ label, value, percentage }: { label: string; value: string | number; percentage?: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {percentage !== undefined && <Progress value={percentage} className="h-2" />}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayerPage({ params }: { params: { teamId: string; playerId: string } }) {
  const { teamId, playerId } = params

  // Get player data
  const teamPlayerData = playerStats[teamId as keyof typeof playerStats]
  const playerData = teamPlayerData?.[playerId as keyof typeof teamPlayerData]

  if (!playerData) {
    // Use default data for players without detailed stats
    const defaultData = {
      id: playerId,
      name: playerId.charAt(0).toUpperCase() + playerId.slice(1),
      position: "F",
      number: 99,
      height: "6'7\"",
      weight: "220 lbs",
      ...defaultPlayerStats,
    }

    return (
      <PlayerStatsPage
        player={defaultData}
        teamId={teamId}
        teamColors={teamColors[teamId as keyof typeof teamColors] || ["#000000", "#FFFFFF"]}
      />
    )
  }

  return (
    <PlayerStatsPage
      player={playerData}
      teamId={teamId}
      teamColors={teamColors[teamId as keyof typeof teamColors] || ["#000000", "#FFFFFF"]}
    />
  )
}

function PlayerStatsPage({
  player,
  teamId,
  teamColors,
}: {
  player: any
  teamId: string
  teamColors: string[]
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href={`/team/${teamId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* Player Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: teamColors[0] }}
            >
              #{player.number}
            </div>

            {/* Player Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{player.name}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <Badge variant="secondary">{player.position}</Badge>
                <span className="text-sm">
                  {player.height} • {player.weight}
                </span>
                <span className="text-sm">Age {player.age}</span>
                <span className="text-sm">{player.experience} years exp.</span>
              </div>
              {player.college && <p className="text-sm text-muted-foreground">{player.college}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Season Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Season Statistics ({player.stats.season})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard label="Games Played" value={player.stats.gamesPlayed} />
                <StatCard label="Minutes/Game" value={player.stats.minutesPerGame} />
                <StatCard label="Points/Game" value={player.stats.pointsPerGame} />
                <StatCard label="Rebounds/Game" value={player.stats.reboundsPerGame} />
                <StatCard label="Assists/Game" value={player.stats.assistsPerGame} />
                <StatCard label="Steals/Game" value={player.stats.stealsPerGame} />
              </div>
            </CardContent>
          </Card>

          {/* Shooting Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Shooting Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="Field Goal %"
                  value={`${player.stats.fieldGoalPercentage}%`}
                  percentage={player.stats.fieldGoalPercentage}
                />
                <StatCard
                  label="Three Point %"
                  value={`${player.stats.threePointPercentage}%`}
                  percentage={player.stats.threePointPercentage}
                />
                <StatCard
                  label="Free Throw %"
                  value={`${player.stats.freeThrowPercentage}%`}
                  percentage={player.stats.freeThrowPercentage}
                />
              </div>
            </CardContent>
          </Card>

          {/* Career Highs */}
          <Card>
            <CardHeader>
              <CardTitle>Career Highs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold text-primary">{player.careerHighs.points}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold text-primary">{player.careerHighs.rebounds}</p>
                  <p className="text-sm text-muted-foreground">Rebounds</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold text-primary">{player.careerHighs.assists}</p>
                  <p className="text-sm text-muted-foreground">Assists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Defensive Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Steals per Game</span>
                    <span className="font-semibold">{player.stats.stealsPerGame}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Blocks per Game</span>
                    <span className="font-semibold">{player.stats.blocksPerGame}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Defensive Rebounds</span>
                    <span className="font-semibold">{(player.stats.reboundsPerGame * 0.7).toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Position</span>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jersey Number</span>
                    <span className="font-semibold">#{player.number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-semibold">{player.experience} years</span>
                  </div>
                  {player.college && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">College</span>
                      <span className="font-semibold">{player.college}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
