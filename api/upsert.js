function calculateGrade(data) {
  let score = 0;

  if (data.clear_height >= 36) score += 6;
  else if (data.clear_height >= 32) score += 5;
  else if (data.clear_height >= 28) score += 3;

  if (data.dock_doors >= 60) score += 6;
  else if (data.dock_doors >= 40) score += 4;

  if (data.utilization < 0.6) score += 18;
  else if (data.utilization < 0.75) score += 14;
  else if (data.utilization < 0.9) score += 8;

  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  return "C";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  const grade = calculateGrade(data);

  res.status(200).json({
    success: true,
    grade
  });
}