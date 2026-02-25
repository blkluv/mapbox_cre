import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const OVERPASS = "https://overpass-api.de/api/interpreter";
  const query = `
    [out:json][timeout:25];
    (
      node["building"="warehouse"](33.45,-84.75,34.05,-84.05);
      way["building"="warehouse"](33.45,-84.75,34.05,-84.05);
    );
    out center tags;
  `;

  try {
    // 1. Load your local persistent data first
    const filePath = path.join(process.cwd(), 'data', 'facilities.json');
    const localData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const localMap = new Map(localData.facilities.map(f => [f.id, f]));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const osmRes = await fetch(OVERPASS, {
      method: "POST",
      body: query,
      signal: controller.signal,
      headers: { "Content-Type": "text/plain" }
    });

    clearTimeout(timeout);
    if (!osmRes.ok) throw new Error(`Overpass returned ${osmRes.status}`);

    const osmData = await osmRes.json();

    const features = (osmData.elements || [])
      .map((el) => {
        const id = `${el.type}-${el.id}`;
        let lon, lat;

        if (el.type === "node") {
          lon = el.lon; lat = el.lat;
        } else if (el.type === "way" && el.center) {
          lon = el.center.lon; lat = el.center.lat;
        } else return null;

        // 2. MERGE LOGIC: If we have local data for this OSM ID, use it.
        const localRecord = localMap.get(id) || {};

        return {
          type: "Feature",
          properties: {
            id: id,
            name: localRecord.name || el.tags?.name || "Warehouse Facility",
            verified: localRecord.verified || 0,
            verification_status: localRecord.verification_status || "unclaimed",
            inspected: localRecord.inspected || 0,
            utilization: localRecord.utilization || null,
            grade: localRecord.grade || null,
            // Fallback to random if no local index exists
            labor_index: localRecord.labor_index || Math.random(),
            source: localRecord.source || "OSM"
          },
          geometry: {
            type: "Point",
            coordinates: [lon, lat]
          }
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      type: "FeatureCollection",
      features
    });

  } catch (error) {
    console.error("Facilities Error:", error.message);
    return res.status(200).json({ type: "FeatureCollection", features: [] });
  }
}
