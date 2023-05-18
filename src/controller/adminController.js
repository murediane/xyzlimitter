const adminController = {
  hasClientPaid: async (clientId, redisClient) => {
    try {
      const clientPaymentDetails = JSON.parse(await redisClient.get(clientId));

      if (clientPaymentDetails?.hasPaid === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking if client has paid:', error);
    }
  },
};

module.exports = {
    adminController,
};