export const sendSlackMessage = async (message: string) => {
  await fetch(`${process.env.SLACK_HOOK_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      text: message,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
}
