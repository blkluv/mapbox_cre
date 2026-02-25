export default async function handler(req, res) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // Use token securely on backend only
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: '@atlwarehouse',
            text: 'New warehouse activity!'
        })
    });
    
    res.status(200).json({ success: true });
}
