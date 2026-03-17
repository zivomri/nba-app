"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PaymentPage() {
  const [name, setName] = useState("NBA App Purchase")
  const [description, setDescription] = useState("Payment for NBA App")
  const [amount, setAmount] = useState("10.00")
  const [currency, setCurrency] = useState("USD")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          amount,
          currency,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create charge")
      if (data.hosted_url) {
        window.location.href = data.hosted_url
        return
      }
      throw new Error("No payment URL returned")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Pay with Coinbase</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a charge and complete payment on Coinbase Commerce.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charge name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this payment for?"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Amount</label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Currency</label>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="USD"
                  maxLength={3}
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Pay with Coinbase"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/" className="underline hover:text-foreground">
          Back to home
        </Link>
      </p>
    </div>
  )
}
