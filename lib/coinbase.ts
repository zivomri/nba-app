/**
 * Coinbase Commerce API client (REST).
 * Set COINBASE_COMMERCE_API_KEY in your environment.
 * @see https://docs.cloud.coinbase.com/api-reference/commerce-api/rest-api/introduction
 */

import crypto from "node:crypto"

const COMMERCE_API_BASE = "https://api.commerce.coinbase.com"
const API_VERSION = "2018-03-22"

export interface CreateChargeParams {
  /** Display name for the charge */
  name: string
  /** Description of what is being paid for */
  description: string
  /** Amount in fiat (e.g. "10.00") */
  amount: string
  /** Fiat currency code (e.g. "USD") */
  currency: string
  /** Optional success redirect URL */
  redirect_url?: string
  /** Optional cancel URL */
  cancel_url?: string
  /** Optional metadata (e.g. orderId, customerId) */
  metadata?: Record<string, string>
}

export interface CommerceCharge {
  id: string
  resource: "charge"
  code: string
  name: string
  description: string
  logo_url: string | null
  hosted_url: string
  created_at: string
  expires_at: string
  timeline: Array<{ time: string; status: string }>
  metadata: Record<string, string>
  pricing: {
    local: { amount: string; currency: string }
    bitcoin?: { amount: string; currency: string }
    ethereum?: { amount: string; currency: string }
  }
  payments: unknown[]
  addresses: Record<string, string>
}

export interface CreateChargeResponse {
  data: CommerceCharge
}

function getApiKey(): string {
  const key = process.env.COINBASE_COMMERCE_API_KEY
  if (!key) {
    throw new Error(
      "COINBASE_COMMERCE_API_KEY is not set. Add it to your .env or environment."
    )
  }
  return key
}

/**
 * Create a Coinbase Commerce charge. Returns the charge with hosted_url for the customer to pay.
 */
export async function createCharge(
  params: CreateChargeParams
): Promise<CreateChargeResponse> {
  const apiKey = getApiKey()

  const body = {
    name: params.name,
    description: params.description,
    pricing_type: "fixed_price" as const,
    local_price: {
      amount: params.amount,
      currency: params.currency,
    },
    ...(params.redirect_url && { redirect_url: params.redirect_url }),
    ...(params.cancel_url && { cancel_url: params.cancel_url }),
    ...(params.metadata && Object.keys(params.metadata).length > 0 && { metadata: params.metadata }),
  }

  const res = await fetch(`${COMMERCE_API_BASE}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": apiKey,
      "X-CC-Version": API_VERSION,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(
      `Coinbase Commerce API error ${res.status}: ${errText || res.statusText}`
    )
  }

  return res.json() as Promise<CreateChargeResponse>
}

/**
 * Verify webhook signature (X-CC-Webhook-Signature) using COINBASE_COMMERCE_WEBHOOK_SECRET.
 * Use in your webhook handler before processing the event.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET
  if (!secret) return false

  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(rawBody)
  const expected = hmac.digest("hex")
  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expected, "utf8")
  )
}
