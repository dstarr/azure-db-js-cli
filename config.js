const uuid = require('uuid/v4');

let config = {};

config.endpoint = "https://<prefix>.documents.azure.com:443/";
config.primaryKey = "<my primary key>";

config.database = {
  "id": "cli-test"
};

config.container = {
  "id": "items"
};

config.documents =
  [
    {
      "id": String(uuid()),
      "description": "Pick up a coconut.",
      "isComplete": "false"
    },
    {
      "id": String(uuid()),
      "description": "Pick up kiwi fruit.",
      "isComplete": "false"
    }
  ];

module.exports = config;