import fs from 'fs';
import path from 'path';

function calculateGrade(data) {
  let score = 0;

  // Clear Height (Standard for Class A is 36'+)
  if (data.clear_height >= 36) score += 25;
  else if (data.clear_height >= 32) score += 15;
  else if (data.clear_height >= 28) score += 10;

  // Dock Density (Crucial for high-velocity 3PL)
  if (data.dock_doors >= 60) score += 25;
  else if (data.dock_doors >= 40) score += 15;
  else if (data.dock_doors >= 20) score += 10;

  // Utilization (Lower utilization = more value for new tenants)
  if (data.utilization < 0.6) score += 30;
  else if (data.utilization < 0.75) score += 20;
  else if (data.utilization < 0.9) score += 10;

  // Labor & Power (Game-changing extras)
  if (data.power_mw >= 2.0) score += 20;

  if (score >= 80) return "A";
  if (score >= 60) return "B+";
  if (score >= 40) return "B";
  return "C";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;
    const grade = calculateGrade(data);
    
    // Path to your JSON file
    const filePath = path.join(process.cwd(), 'data', 'facilities.json');
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const newFacility = {
      ...data,
      grade,
      verified: 0,
      timestamp: new Date().toISOString()
    };

    fileData.facilities.push(newFacility);
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    res.status(200).json({ success: true, grade, facility: newFacility });
  } catch (error) {
    res.status(500).json({ error: "Failed to save facility data" });
  }
}
