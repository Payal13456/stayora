const SCHEDULE_LIST_URL =
  "https://api.myhomivo.com//properties/owner-schedule-requests";
const SCHEDULE_ACTION_URL =
  "https://api.myhomivo.com//properties/schedule-requests";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    try {
      const response = await fetch(SCHEDULE_LIST_URL, {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return res
          .status(response.status)
          .json({
            success: false,
            message: data?.message || "Failed to fetch schedule requests",
          });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error proxying schedule requests GET:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Unable to fetch schedule requests.",
        });
    }
  }

  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    const { requestId, action } = req.body || {};
    if (!requestId || !["accept", "reject"].includes(action)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "requestId and valid action are required",
        });
    }

    try {
      const response = await fetch(
        `${SCHEDULE_ACTION_URL}/${requestId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return res
          .status(response.status)
          .json({
            success: false,
            message: data?.message || "Failed to update schedule request",
          });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error proxying schedule request POST:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Unable to update schedule request.",
        });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
