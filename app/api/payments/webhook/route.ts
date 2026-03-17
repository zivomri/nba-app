import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/coinbase"

/**
 * POST /api/payments/webhook – Coinbase Commerce webhook.
 * Set COINBASE_COMMERCE_WEBHOOK_SECRET in your environment and configure this URL in Commerce dashboard.
 * Verifies X-CC-Webhook-Signature and processes charge events (e.g. charge:confirmed).
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-cc-webhook-signature") ?? null

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as {
      id?: string
      type?: string
      event?: { id: string; resource: string; type: string; data?: unknown }
    }

    const eventType = event.event?.type ?? event.type
    const eventId = event.event?.id ?? event.id

    if (eventType === "charge:confirmed") {
      // Payment confirmed – update order, grant access, etc.
      console.log("[payments/webhook] Charge confirmed:", eventId, event.event?.data)
      // TODO: persist to DB, send confirmation email, etc.
    } else if (eventType === "charge:failed") {
      console.log("[payments/webhook] Charge failed:", eventId, event.event?.data)
    } else {
      console.log("[payments/webhook] Event:", eventType, eventId)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[payments/webhook] Error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook error" },
      { status: 500 }
    )
  }
}
