// Code to set up for
module.exports = {
  tables: [
    {
      TableName: 'apiKeyTable',
      KeySchema: [{ AttributeName: 'apiKey', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'apiKey', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    // other tables
  ],
  port: 8000,
};
