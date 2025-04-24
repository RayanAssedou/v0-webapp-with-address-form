// In a real application, you would use a proper email service like SendGrid, Mailgun, etc.
// This is a mock implementation for demonstration purposes

export interface EmailParams {
  to: string
  subject: string
  body: string
}

export async function sendEmail({ to, subject, body }: EmailParams): Promise<boolean> {
  // In a real implementation, you would use an email service API
  console.log(`Sending email to ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)

  // Simulate a successful email send
  return true
}
