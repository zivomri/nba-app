# Coinbase Commerce Payments

The app uses the **Coinbase Commerce REST API** for crypto payments. No extra npm package is required; the implementation uses native `fetch` and `crypto`.

## Setup

1. **API key**  
   Create an API key in [Coinbase Commerce](https://commerce.coinbase.com/) and set:

   ```bash
   COINBASE_COMMERCE_API_KEY=your_api_key
   ```

2. **Webhook (optional)**  
   To handle payment events (e.g. `charge:confirmed`), set a webhook secret and register the URL in the Commerce dashboard:

   ```bash
   COINBASE_COMMERCE_WEBHOOK_SECRET=your_webhook_secret
   ```

   Webhook URL: `https://your-domain.com/api/payments/webhook`

3. **Redirects**  
   For success/cancel redirects after checkout, set your app URL (optional; defaults to Vercel URL when deployed):

   ```bash
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

## Usage

- **Create a charge:** `POST /api/payments` with JSON body:
  - `name` (string, required)
  - `description` (string, required)
  - `amount` (string, e.g. `"10.00"`, required)
  - `currency` (string, default `"USD"`)
  - `redirect_url`, `cancel_url`, `metadata` (optional)

- **Payment page:** `/payment` – form that creates a charge and redirects to Coinbase hosted checkout.

- **Success / cancel:** `/payment/success` and `/payment/cancel` – landing pages after checkout.

## Dependencies

No additional npm dependencies. The implementation lives in:

- `lib/coinbase.ts` – API client and webhook signature verification
- `app/api/payments/route.ts` – create charge
- `app/api/payments/webhook/route.ts` – webhook handler
