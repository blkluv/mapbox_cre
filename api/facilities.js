import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const OVERPASS = "https://overpass-api.de/api/interpreter";
        
        // Atlanta bounding box
        const query = `
            [out:json][timeout:25];
            (
                node["building"="warehouse"](33.45,-84.75,34.05,-84.05);
                way["building"="warehouse"](33.45,-84.75,34.05,-84.05);
            );
            out center tags;
        `;

        console.log("Fetching from Overpass...");
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const osmRes = await fetch(OVERPASS, {
            method: "POST",
            body: query,
            signal: controller.signal,
            headers: { "Content-Type": "text/plain" }
        });

        clearTimeout(timeout);

        if (!osmRes.ok) {
            throw new Error(`Overpass error: ${osmRes.status}`);
        }

        const osmData = await osmRes.json();
        console.log(`Found ${osmData.elements?.length || 0} elements`);

        // Load local data
        let localMap = new Map();
        try {
            const filePath = path.join(process.cwd(), 'data', 'facilities.json');
            if (fs.existsSync(filePath)) {
                const localData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                localData.facilities?.forEach(f => localMap.set(f.id, f));
            }
        } catch (e) {
            console.log("No local data found");
        }

        // Transform to GeoJSON
        const features = (osmData.elements || [])
            .map(el => {
                let lon, lat;
                
                if (el.type === "node") {
                    lon = el.lon;
                    lat = el.lat;
                } else if (el.type === "way" && el.center) {
                    lon = el.center.lon;
                    lat = el.center.lat;
                } else {
                    return null;
                }

                const id = `${el.type}-${el.id}`;
                const local = localMap.get(id) || {};

                return {
                    type: "Feature",
                    properties: {
                        id: id,
                        name: local.name || el.tags?.name || "Atlanta Warehouse",
                        grade: local.grade || ['A', 'B+', 'A-'][Math.floor(Math.random() * 3)],
                        power_mw: local.power_mw || (Math.random() * 5 + 1).toFixed(1),
                        utilization: local.utilization || Math.floor(Math.random() * 100),
                        verification_status: local.verification_status || "unverified",
                        source: "OSM + Local"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    }
                };
            })
            .filter(f => f !== null);

        console.log(`Returning ${features.length} features`);

        return res.status(200).json({
            type: "FeatureCollection",
            features: features
        });

    } catch (error) {
        console.error("API Error:", error);
        
        // Return empty but valid GeoJSON
        return res.status(200).json({
            type: "FeatureCollection",
            features: []
        });
    }
}
