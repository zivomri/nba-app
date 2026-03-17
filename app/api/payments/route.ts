import { NextRequest, NextResponse } from "next/server"
import { createCharge } from "@/lib/coinbase"
import { listWallets } from "@/lib/coinbase-sdk"
import { savePayment } from "@/lib/db"
import { sendMail } from "@/lib/email"

/**
 * POST /api/payments – Create a Coinbase Commerce charge.
 * Body: { name, description, amount, currency, redirect_url?, cancel_url?, metadata?, email? }
 * Returns: { charge } with hosted_url for the customer to complete payment.
 * Dummy usage: saves payment to MongoDB and sends a confirmation email if configured.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const amount = typeof body.amount === "string" ? body.amount.trim() : String(body.amount ?? "")
    const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD"
    const email = typeof body.email === "string" ? body.email.trim() : undefined

    if (!name || !description) {
      return NextResponse.json(
        { error: "name and description are required" },
        { status: 400 }
      )
    }

    const num = parseFloat(amount)
    if (Number.isNaN(num) || num <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      )
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
    const redirectUrl = body.redirect_url || (baseUrl ? `${baseUrl}/payment/success` : undefined)
    const cancelUrl = body.cancel_url || (baseUrl ? `${baseUrl}/payment/cancel` : undefined)

    const response = await createCharge({
      name,
      description,
      amount: num.toFixed(2),
      currency: currency || "USD",
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
      metadata:
        typeof body.metadata === "object" && body.metadata !== null
          ? Object.fromEntries(
              Object.entries(body.metadata).filter(
                (e): e is [string, string] =>
                  typeof e[0] === "string" && typeof e[1] === "string"
              )
            )
          : undefined,
    })

    const chargeId = response.data.id

    // Dummy: persist payment to MongoDB (no-op if MONGODB_URI not set)
    await savePayment({
      chargeId,
      amount: num,
      currency: currency || "USD",
      status: "created",
    })

    // Dummy: send confirmation email via Mailgun (no-op if MAILGUN_* not set)
    if (email) {
      await sendMail({
        to: email,
        subject: `Payment created: ${name}`,
        text: `Your payment of ${num} ${currency} is ready. Complete at: ${response.data.hosted_url}`,
      })
    }

    return NextResponse.json({
      charge: response.data,
      hosted_url: response.data.hosted_url,
    })
  } catch (err) {
    console.error("[payments] Create charge error:", err)
    const message = err instanceof Error ? err.message : "Failed to create charge"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payments – Dummy usage of @coinbase/coinbase-sdk: list CDP wallets (if configured).
 */
export async function GET() {
  try {
    const wallets = await listWallets()
    return NextResponse.json({
      wallets,
      message:
        wallets.length === 0
          ? "No CDP wallets or COINBASE_CDP_API_KEY_NAME/COINBASE_CDP_PRIVATE_KEY not set."
          : undefined,
    })
  } catch (err) {
    console.error("[payments] List wallets error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list wallets", wallets: [] },
      { status: 200 }
    )
  }
}
