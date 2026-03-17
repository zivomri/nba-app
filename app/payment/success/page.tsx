import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment successful</CardTitle>
          <p className="text-muted-foreground">
            Thank you. Your payment was completed successfully.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
