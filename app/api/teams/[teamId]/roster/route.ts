import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const { teamId } = params

    // First get team info
    const teamsResponse = await fetch("https://content-api-prod.nba.com/public/1/leagues/nba/teams", {
      headers: {
        "User-Agent": "NBA-App/1.0",
      },
    })

    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.status}`)
    }

    const teamsData = await teamsResponse.json()
    const team = teamsData.results?.items?.find((t: any) => t.tid.toString() === teamId)

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Then get roster
    const rosterResponse = await fetch(`https://content-api-prod.nba.com/public/1/leagues/nba/teams/${teamId}/roster`, {
      headers: {
        "User-Agent": "NBA-App/1.0",
      },
    })

    if (!rosterResponse.ok) {
      throw new Error(`Failed to fetch roster: ${rosterResponse.status}`)
    }

    const rosterData = await rosterResponse.json()

    return NextResponse.json({
      team,
      roster: rosterData.results?.roster || [],
      coaches: rosterData.results?.coaches || [],
    })
  } catch (error) {
    console.error("Error fetching team roster:", error)
    return NextResponse.json({ error: "Failed to fetch team roster" }, { status: 500 })
  }
}
