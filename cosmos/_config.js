let config = {};

config.db = {
  id:             '[COSMOS DB NAME]',
  primaryKey:     '[YOUR DB ACCESS KEY]',
  uri:            'https://[COSMOS DB NAME].documents.azure.com:443/'
};

config.container = {
  id: '[YOUR CONTAINER NAME]'
};

module.exports = config;