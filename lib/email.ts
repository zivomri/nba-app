/**
 * Dummy Nodemailer + Mailgun usage.
 * Set MAILGUN_API_KEY and MAILGUN_DOMAIN (and optionally FROM_EMAIL) in your environment.
 */

import nodemailer from "nodemailer"
import mailgunTransport from "nodemailer-mailgun-transport"

function getTransport(): nodemailer.Transporter | null {
  const apiKey = process.env.MAILGUN_API_KEY
  const domain = process.env.MAILGUN_DOMAIN
  if (!apiKey || !domain) return null

  const transport = mailgunTransport({
    auth: { api_key: apiKey, domain },
  })
  return nodemailer.createTransport(transport)
}

/**
 * Dummy: send an email via Mailgun. No-op if Mailgun is not configured.
 */
export async function sendMail(options: {
  to: string
  subject: string
  text?: string
  html?: string
}): Promise<{ success: boolean; messageId?: string }> {
  const transporter = getTransport()
  if (!transporter) return { success: false }

  const from = process.env.FROM_EMAIL ?? `noreply@${process.env.MAILGUN_DOMAIN ?? "example.com"}`
  const info = await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
  return { success: true, messageId: info.messageId }
}
