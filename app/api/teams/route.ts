import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://content-api-prod.nba.com/public/1/leagues/nba/teams", {
      headers: {
        "User-Agent": "NBA-App/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`NBA API responded with status: ${response.status}`)
    }

    const data = await response.json()

    console.log("[v0] Full response keys:", Object.keys(data))
    if (data.results) {
      console.log("[v0] Results keys:", Object.keys(data.results))
      console.log("[v0] Results.items exists:", !!data.results.items)
      console.log("[v0] Results.items length:", data.results.items?.length)
    }

    let teams = []

    if (data.results && data.results.items && Array.isArray(data.results.items)) {
      console.log("[v0] Using data.results.items structure")
      teams = data.results.items
    } else if (data.results && Array.isArray(data.results)) {
      console.log("[v0] Using data.results as direct array")
      teams = data.results
    } else if (data.league?.standard) {
      console.log("[v0] Using data.league.standard structure")
      teams = data.league.standard.filter((team: any) => team.isNBAFranchise)
    } else if (data.teams) {
      console.log("[v0] Using data.teams structure")
      teams = data.teams
    } else if (Array.isArray(data)) {
      console.log("[v0] Using direct array structure")
      teams = data
    } else {
      console.log("[v0] Available keys:", Object.keys(data))
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) {
          console.log(`[v0] Found array at data.${key} with ${data[key].length} items`)
          teams = data[key]
          break
        }
        if (data[key] && typeof data[key] === "object") {
          for (const subKey of Object.keys(data[key])) {
            if (Array.isArray(data[key][subKey])) {
              console.log(`[v0] Found array at data.${key}.${subKey} with ${data[key][subKey].length} items`)
              teams = data[key][subKey]
              break
            }
          }
        }
      }

      if (teams.length === 0) {
        console.log("[v0] No teams array found anywhere in response")
        throw new Error(`No teams found in response. Structure: ${JSON.stringify(Object.keys(data))}`)
      }
    }

    if (!teams || teams.length === 0) {
      throw new Error(`No teams found in response`)
    }

    console.log(`[v0] Successfully found ${teams.length} teams`)
    return NextResponse.json({ teams })
  } catch (error) {
    console.error("[v0] Error fetching NBA teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams data" }, { status: 500 })
  }
}
