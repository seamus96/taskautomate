export async function sendAlert({ subject, message }: { subject: string; message: string }) {
  if (process.env.TEAMS_WEBHOOK_URL) {
    await fetch(process.env.TEAMS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `**${subject}**\n\n${message}` })
    });
  }
}
