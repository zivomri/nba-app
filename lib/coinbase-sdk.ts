/**
 * Dummy usage of @coinbase/coinbase-sdk (CDP wallets).
 * Set COINBASE_CDP_API_KEY_NAME and COINBASE_CDP_PRIVATE_KEY in your environment.
 * @see https://github.com/coinbase/coinbase-sdk-nodejs
 */

import { Coinbase, Wallet } from "@coinbase/coinbase-sdk"

function configureSdk(): void {
  const name = process.env.COINBASE_CDP_API_KEY_NAME
  const privateKey = process.env.COINBASE_CDP_PRIVATE_KEY
  if (!name || !privateKey) {
    throw new Error(
      "COINBASE_CDP_API_KEY_NAME and COINBASE_CDP_PRIVATE_KEY must be set to use the Coinbase SDK."
    )
  }
  Coinbase.configure({ apiKeyName: name, privateKey })
}

/**
 * List wallets for the CDP project (dummy usage of @coinbase/coinbase-sdk).
 * Returns wallet list or empty array if SDK is not configured.
 */
export async function listWallets(): Promise<{ id: string; [key: string]: unknown }[]> {
  try {
    configureSdk()
    const resp = await Wallet.listWallets()
    const data = (resp as { data?: { wallets?: { id?: string }[] } })?.data
    const wallets = data?.wallets ?? []
    return wallets as { id: string; [key: string]: unknown }[]
  } catch {
    return []
  }
}
