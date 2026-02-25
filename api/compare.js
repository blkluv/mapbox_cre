export default async function handler(req, res) {
  const { facilityId } = req.query;

  res.status(200).json({
    facilityId,
    comparisons: [
      { name: "3PL A", on_time: 0.971, claim_rate: 0.004 },
      { name: "3PL B", on_time: 0.952, claim_rate: 0.007 },
      { name: "3PL C", on_time: 0.941, claim_rate: 0.010 }
    ]
  });
}