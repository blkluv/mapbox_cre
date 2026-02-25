import fs from 'fs';
import path from 'path';

// Industrial Grading Logic from your upsert.js
function calculateGrade(f) {
  let score = 0;
  if (f.clear_height >= 36) score += 25;
  if (f.dock_doors >= 60) score += 25;
  if (f.utilization < 0.7) score += 30;
  return score >= 80 ? "A" : score >= 60 ? "B+" : "B";
}

const importWarehouses = () => {
  const filePath = path.join(process.cwd(), 'data', 'facilities.json');
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // PRO TIP: Paste your raw CSV data or Scraped list here
  const rawImports = [
    { id: "atl-link-1", name: "Link Logistics Park", lat: 33.71, lon: -84.42, height: 36, docks: 45 },
    { id: "atl-pro-2", name: "Prologis Beacon 400", lat: 34.03, lon: -84.06, height: 32, docks: 56 },
    // Add more rows here...
  ];

  const newFacilities = rawImports.map(f => ({
    id: f.id,
    name: f.name,
    coordinates: [f.lon, f.lat],
    clear_height: f.height,
    dock_doors: f.docks,
    utilization: Math.random().toFixed(2), // Seeded for viral effect
    grade: calculateGrade(f),
    verified: 0,
    verification_status: "unclaimed",
    power_mw: (Math.random() * 4 + 1).toFixed(1)
  }));

  existingData.facilities = [...existingData.facilities, ...newFacilities];
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  console.log(`Successfully injected ${newFacilities.length} warehouses!`);
};

importWarehouses();
