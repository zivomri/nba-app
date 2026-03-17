import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment cancelled</CardTitle>
          <p className="text-muted-foreground">
            Your payment was cancelled. You can try again whenever you’re ready.
          </p>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/payment">Try again</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
