import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests for security and data integrity
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { facilityId, email, company } = req.body;

  // Validate that the essential fields are present
  if (!facilityId || !email) {
    return res.status(400).json({ error: "Missing required fields: facilityId and email are required." });
  }

  try {
    // 1. Resolve the path to your data file
    const filePath = path.join(process.cwd(), 'data', 'facilities.json');
    
    // 2. Read the existing data
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileData = JSON.parse(fileContent);

    // 3. Find the specific facility by its ID
    const index = fileData.facilities.findIndex(f => f.id === facilityId);

    if (index !== -1) {
      // 4. Update the record with "pending" status and user details
      fileData.facilities[index].verification_status = "pending";
      fileData.facilities[index].claimed_by = email;
      fileData.facilities[index].claimed_company = company || "Not Specified";
      fileData.facilities[index].last_updated = new Date().toISOString();

      // 5. Write the updated array back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

      return res.status(200).json({
        success: true,
        message: "Claim submitted for review and facility status updated to pending.",
        facilityId: facilityId
      });
    } else {
      // If the facility doesn't exist in the JSON, we return a 404
      return res.status(404).json({ 
        error: "Facility not found. Ensure the facility has been added to the system before claiming." 
      });
    }

  } catch (error) {
    console.error("Claim Error:", error);
    return res.status(500).json({ error: "Internal server error while processing the claim." });
  }
}
