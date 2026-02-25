import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Industrial Grading Logic
function calculateGrade(f) {
  let score = 0;
  if (f.clear_height >= 36) score += 25;
  else if (f.clear_height >= 30) score += 15;
  if (f.dock_doors >= 60) score += 25;
  else if (f.dock_doors >= 40) score += 15;
  else if (f.dock_doors >= 20) score += 5;
  if (f.utilization < 0.7) score += 30;
  else if (f.utilization < 0.85) score += 15;
  
  if (f.power_mw >= 5) score += 10;
  else if (f.power_mw >= 2) score += 5;
  
  return score >= 80 ? "A" : score >= 60 ? "B+" : score >= 40 ? "B" : "C";
}

// Generate realistic power capacity based on size
function generatePower(docks) {
  if (docks > 80) return (Math.random() * 8 + 7).toFixed(1); // 7-15 MW
  if (docks > 50) return (Math.random() * 5 + 3).toFixed(1); // 3-8 MW
  if (docks > 20) return (Math.random() * 3 + 1).toFixed(1); // 1-4 MW
  return (Math.random() * 1 + 0.5).toFixed(1); // 0.5-1.5 MW
}

// Generate realistic square footage based on docks
function generateSqFt(docks) {
  const base = docks * 5000; // Rough estimate: 5000 sq ft per dock door
  const variance = Math.random() * 0.3 + 0.85; // 85-115% variance
  return Math.round(base * variance / 1000) * 1000; // Round to nearest 1000
}

const importAtlantaWarehouses = () => {
  const filePath = path.join(__dirname, 'data', 'facilities.json');
  let existingData = { facilities: [] };
  
  try {
    existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📂 Loaded existing file with ${existingData.facilities.length} facilities`);
  } catch (error) {
    console.log('🆕 Creating new facilities file...');
  }

  // ============================================
  // ATLANTA WAREHOUSE DATA – 1,700+ FACILITIES
  // ============================================
  
  // This is a GENERATOR that creates realistic warehouse data
  // In production, you would replace this with actual CSV/API data
  
  const atlantaSubmarkets = [
    { name: "Fulton Industrial", latMin: 33.75, latMax: 33.82, lonMin: -84.48, lonMax: -84.42, baseDocks: 45, baseHeight: 32 },
    { name: "South Atlanta/Airport", latMin: 33.60, latMax: 33.70, lonMin: -84.52, lonMax: -84.44, baseDocks: 38, baseHeight: 30 },
    { name: "Gwinnett", latMin: 33.95, latMax: 34.10, lonMin: -84.12, lonMax: -83.98, baseDocks: 42, baseHeight: 34 },
    { name: "I-85 North", latMin: 34.00, latMax: 34.15, lonMin: -84.20, lonMax: -84.05, baseDocks: 35, baseHeight: 32 },
    { name: "I-75 North", latMin: 34.02, latMax: 34.18, lonMin: -84.65, lonMax: -84.52, baseDocks: 32, baseHeight: 30 },
    { name: "Westside/Howell Mill", latMin: 33.78, latMax: 33.84, lonMin: -84.46, lonMax: -84.38, baseDocks: 28, baseHeight: 28 },
    { name: "Norcross", latMin: 33.92, latMax: 33.98, lonMin: -84.22, lonMax: -84.15, baseDocks: 30, baseHeight: 30 },
    { name: "South Fulton", latMin: 33.55, latMax: 33.65, lonMin: -84.58, lonMax: -84.48, baseDocks: 25, baseHeight: 28 },
    { name: "Kennesaw", latMin: 34.02, latMax: 34.08, lonMin: -84.62, lonMax: -84.58, baseDocks: 22, baseHeight: 26 },
    { name: "Stone Mountain", latMin: 33.80, latMax: 33.88, lonMin: -84.18, lonMax: -84.08, baseDocks: 20, baseHeight: 26 },
    { name: "Decatur", latMin: 33.76, latMax: 33.82, lonMin: -84.32, lonMax: -84.24, baseDocks: 18, baseHeight: 24 },
    { name: "Forest Park", latMin: 33.61, latMax: 33.66, lonMin: -84.38, lonMax: -84.34, baseDocks: 24, baseHeight: 28 },
    { name: "College Park", latMin: 33.62, latMax: 33.68, lonMin: -84.52, lonMax: -84.44, baseDocks: 26, baseHeight: 28 },
    { name: "East Point", latMin: 33.66, latMax: 33.72, lonMin: -84.48, lonMax: -84.42, baseDocks: 22, baseHeight: 26 },
    { name: "Marietta", latMin: 33.92, latMax: 34.00, lonMin: -84.58, lonMax: -84.48, baseDocks: 28, baseHeight: 28 },
    { name: "Smyrna", latMin: 33.86, latMax: 33.92, lonMin: -84.54, lonMax: -84.48, baseDocks: 20, baseHeight: 26 },
    { name: "Doraville", latMin: 33.89, latMax: 33.94, lonMin: -84.32, lonMax: -84.26, baseDocks: 24, baseHeight: 26 },
    { name: "Chamblee", latMin: 33.88, latMax: 33.92, lonMin: -84.32, lonMax: -84.28, baseDocks: 18, baseHeight: 24 },
    { name: "Tucker", latMin: 33.84, latMax: 33.90, lonMin: -84.24, lonMax: -84.18, baseDocks: 20, baseHeight: 26 },
    { name: "Lithia Springs", latMin: 33.78, latMax: 33.84, lonMin: -84.68, lonMax: -84.60, baseDocks: 22, baseHeight: 28 },
  ];

  // Major real estate companies operating in Atlanta
  const owners = [
    "Prologis", "Dermody Properties", "Link Logistics", "LBA Logistics", "Panattoni",
    "First Industrial", "Majestic Realty", "Exeter", "Duke Realty", "Seefried Properties",
    "IDI Logistics", "Trammell Crow", "CRG", "VanTrust", "Clarion Partners",
    "Stockbridge", "Hines", "CBRE IM", "JLL", "Cushman & Wakefield",
    "EastGroup", "Rexford", "STAG Industrial", "Terreno", "Plymouth Industrial",
    "Private Owner", "Local Investment Group", "Family Trust", "REIT", "Institutional Investor"
  ];

  const prefixes = [
    "Atlanta", "Georgia", "Peachtree", "South", "West", "North", "East", "Central",
    "Fulton", "Gwinnett", "Cobb", "DeKalb", "Clayton", "Airport", "Industrial",
    "Commerce", "Distribution", "Logistics", "Warehouse", "Business", "Corporate"
  ];

  const suffixes = [
    "Park", "Center", "Commons", "Pointe", "Crossing", "Place", "Plaza", "Court",
    "Drive", "Lane", "Way", "Circle", "Business Park", "Industrial Park", "Commerce Center"
  ];

  const generateWarehouseName = (submarket, index) => {
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Mix of naming conventions
    const rand = Math.random();
    if (rand < 0.3) return `${owner} – ${submarket.name} ${suffix}`;
    if (rand < 0.6) return `${prefix} ${suffix}`;
    if (rand < 0.8) return `${submarket.name} ${suffix}`;
    return `${owner} – Building ${Math.floor(Math.random() * 20) + 1}`;
  };

  // Target: 1,700 warehouses
  const targetCount = 1700;
  const newFacilities = [];
  
  // Distribute warehouses across submarkets based on density
  const submarketDensities = {
    "Fulton Industrial": 320,
    "South Atlanta/Airport": 280,
    "Gwinnett": 260,
    "I-85 North": 150,
    "I-75 North": 140,
    "Westside/Howell Mill": 90,
    "Norcross": 85,
    "South Fulton": 80,
    "Kennesaw": 60,
    "Stone Mountain": 50,
    "Forest Park": 45,
    "College Park": 40,
    "Marietta": 35,
    "Decatur": 20,
    "East Point": 15,
    "Smyrna": 10,
    "Doraville": 8,
    "Chamblee": 6,
    "Tucker": 4,
    "Lithia Springs": 2
  };

  console.log("🏭 Generating 1,700+ Atlanta warehouses...");

  let idCounter = 1;
  
  for (const submarket of atlantaSubmarkets) {
    const count = submarketDensities[submarket.name] || 10;
    
    for (let i = 0; i < count; i++) {
      // Generate realistic variations
      const dockVariation = Math.floor(Math.random() * 30) - 10; // -10 to +20
      const docks = Math.max(5, Math.floor(submarket.baseDocks + dockVariation + (Math.random() * 20)));
      
      const heightVariation = Math.floor(Math.random() * 12) - 4; // -4 to +8
      const height = Math.max(18, submarket.baseHeight + heightVariation);
      
      // Random location within submarket bounds
      const lat = submarket.latMin + Math.random() * (submarket.latMax - submarket.latMin);
      const lon = submarket.lonMin + Math.random() * (submarket.lonMax - submarket.lonMin);
      
      // Generate realistic utilization (higher in prime areas)
      let utilization;
      if (submarket.name === "Fulton Industrial" || submarket.name === "South Atlanta/Airport") {
        utilization = 0.75 + Math.random() * 0.2; // 75-95%
      } else if (submarket.name === "Gwinnett" || submarket.name === "I-85 North") {
        utilization = 0.7 + Math.random() * 0.25; // 70-95%
      } else {
        utilization = 0.6 + Math.random() * 0.3; // 60-90%
      }
      
      const powerMw = generatePower(docks);
      const sqft = generateSqFt(docks);
      
      const facility = {
        id: `atl-warehouse-${idCounter.toString().padStart(4, '0')}`,
        name: generateWarehouseName(submarket, i),
        coordinates: [lon, lat],
        clear_height: height,
        dock_doors: docks,
        utilization: parseFloat(utilization.toFixed(2)),
        grade: calculateGrade({
          clear_height: height,
          dock_doors: docks,
          utilization: utilization,
          power_mw: parseFloat(powerMw)
        }),
        verified: Math.random() > 0.7 ? 1 : 0, // 30% verified
        verification_status: Math.random() > 0.7 ? "verified" : "unclaimed",
        power_mw: parseFloat(powerMw),
        square_feet: sqft,
        submarket: submarket.name,
        address: `${Math.floor(Math.random() * 5000)} Industrial Blvd`,
        city: submarket.name.includes("Atlanta") ? "Atlanta" : 
               submarket.name.includes("Gwinnett") ? "Lawrenceville" :
               submarket.name.includes("Cobb") ? "Marietta" : "Atlanta",
        state: "GA",
        zip: `${Math.floor(30000 + Math.random() * 1000)}`,
        year_built: Math.floor(1970 + Math.random() * 45),
        owner: owners[Math.floor(Math.random() * owners.length)]
      };
      
      newFacilities.push(facility);
      idCounter++;
    }
  }

  // Add your specific known facilities
  const knownFacilities = [
    {
      id: "atl-4250-stacks",
      name: "4250 Stacks Road – College Park",
      coordinates: [-84.516, 33.632],
      clear_height: 24,
      dock_doors: 3,
      utilization: 0.85,
      grade: "B",
      verified: 1,
      verification_status: "verified",
      power_mw: 1.2,
      square_feet: 6900,
      submarket: "College Park",
      address: "4250 Stacks Rd",
      city: "College Park",
      state: "GA",
      zip: "30349",
      owner: "Cory Allen"
    },
    {
      id: "atl-camp-creek",
      name: "Camp Creek Market",
      coordinates: [-84.528, 33.645],
      clear_height: 24,
      dock_doors: 6,
      utilization: 0.75,
      grade: "B",
      verified: 1,
      verification_status: "verified",
      power_mw: 1.5,
      square_feet: 12000,
      submarket: "South Atlanta/Airport",
      address: "Camp Creek Pkwy",
      city: "Atlanta",
      state: "GA",
      zip: "30344",
      owner: "Camp Creek Holdings"
    },
    {
      id: "atl-miu-demo",
      name: "MIU Demo Warehouse – Atlanta",
      coordinates: [-84.456, 33.789],
      clear_height: 28,
      dock_doors: 12,
      utilization: 0.9,
      grade: "B+",
      verified: 1,
      verification_status: "verified",
      power_mw: 2.4,
      square_feet: 25000,
      submarket: "Fulton Industrial",
      address: "123 MIU Way",
      city: "Atlanta",
      state: "GA",
      zip: "30336",
      owner: "ATLwarehouse Demo"
    }
  ];

  // Combine generated + known facilities
  newFacilities.push(...knownFacilities);

  // Remove duplicates by coordinates (approx)
  const uniqueFacilities = [];
  const seen = new Set();
  
  for (const facility of newFacilities) {
    const key = `${facility.coordinates[0].toFixed(4)},${facility.coordinates[1].toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFacilities.push(facility);
    }
  }

  // Update existing data
  existingData.facilities = [...existingData.facilities, ...uniqueFacilities];
  
  // Write file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`   Generated: ${uniqueFacilities.length} warehouses`);
  console.log(`   Target: 1,700`);
  console.log(`   Coverage: ${Math.round(uniqueFacilities.length/1700*100)}%`);
  console.log(`\n📊 Breakdown by submarket:`);
  
  // Count by submarket
  const counts = {};
  uniqueFacilities.forEach(f => {
    counts[f.submarket] = (counts[f.submarket] || 0) + 1;
  });
  
  Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([sub, cnt]) => {
    console.log(`   ${sub.padEnd(25)}: ${cnt}`);
  });
  
  console.log(`\n📁 File saved to: ${filePath}`);
};

importAtlantaWarehouses();
