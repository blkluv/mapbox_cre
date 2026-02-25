export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { facilityId, email, company } = req.body;

  if (!facilityId || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  res.status(200).json({
    success: true,
    message: "Claim submitted for review"
  });
}