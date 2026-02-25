export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Only expose what's needed client-side
    res.status(200).json({
        mapboxToken: process.env.MAPBOX_TOKEN,
        // Never expose sensitive tokens here
        telegramBotUsername: "@atlwarehouse" // safe to expose
    });
}
