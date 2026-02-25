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

  const osmRes = await fetch(OVERPASS, {
    method: "POST",
    body: query
  });

  const osmData = await osmRes.json();

  const features = osmData.elements.map(el => {
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

    return {
      type: "Feature",
      properties: {
        id: `${el.type}-${el.id}`,
        name: el.tags?.name || "Warehouse Facility",
        verified: 0,
        inspected: 0,
        utilization: null,
        grade: null,
        labor_index: Math.random()
      },
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      }
    };
  }).filter(Boolean);

  res.status(200).json({
    type: "FeatureCollection",
    features
  });
}