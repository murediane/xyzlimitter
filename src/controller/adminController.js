// Dummy data
const clientData = [
    { id: '1234567890-1', name: 'Client1', hasPaid: true, rqpersec: 10 },
    { id: '1234567890-2', name: 'Client2', hasPaid: false, rqpersec: 10 },
    { id: '1234567890-3', name: 'Client3', hasPaid: true, rqpersec: 10 },
  ];
  
  // Standalone controller function
  const adminController = {
    hasClientPaid: (clientId) => {
      const client = clientData.find((client) => client.id == clientId);
  
      if (client) {
        return { hasPaid: client.hasPaid };
      } else {
        console.log('Client not found');
      }
    },
  };
  
  module.exports = adminController;