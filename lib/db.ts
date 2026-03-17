/**
 * Dummy Mongoose usage – connection and a simple Payment model.
 * Set MONGODB_URI in your environment to connect.
 */

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/nba-app"

let cached = (global as unknown as { mongooseConn?: mongoose.Mongoose })?.mongooseConn
if (!cached) cached = (global as unknown as { mongooseConn?: mongoose.Mongoose }).mongooseConn = undefined

export async function connectDb(): Promise<mongoose.Mongoose | null> {
  if (cached) return cached
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    cached = conn
    return conn
  } catch {
    return null
  }
}

const PaymentSchema = new mongoose.Schema(
  {
    chargeId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
)

export const PaymentModel =
  mongoose.models?.Payment ?? mongoose.model("Payment", PaymentSchema)

/**
 * Dummy: save a payment record to MongoDB.
 */
export async function savePayment(params: {
  chargeId: string
  amount: number
  currency?: string
  status?: string
}): Promise<mongoose.Document | null> {
  try {
    await connectDb()
    const doc = await PaymentModel.create({
      chargeId: params.chargeId,
      amount: params.amount,
      currency: params.currency ?? "USD",
      status: params.status ?? "pending",
    })
    return doc
  } catch {
    return null
  }
}
