// Function to update client details
const paymentController = {
  updateClientDetails: async (req, res) => {
    const redisClient = req.redisClient;
    const has_paid = false;

    const clientId = req.headers["client-id"];

    if (!clientId) {
      res.status(400).json({ error: "client not found" });
      return;
    }

    const userPaymendData = await redisClient.get(clientId);
    redisClient.set(
      clientId,
      JSON.stringify({
        timestamp: new Date().getTime(),
        hasPaid: true,
      })
    );
  },
};

// Export the controller function
module.exports = {
  paymentController,
};
