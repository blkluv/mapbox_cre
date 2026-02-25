export default function handler(req, res) {
  res.status(200).json({
    mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  });
}