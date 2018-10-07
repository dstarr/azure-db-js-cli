const uuid = require('uuid/v4');

let config = {};

config.endpoint = "https://cli-test.documents.azure.com:443/";
config.primaryKey = "qr1g4JbcrWv7Cc6oreNPWGyaHc4F6hnGAyfJSofbZ2sQz99RDM6kimKRkldPwFqjP9nedf8brxnHvh5Jw6qOYw==";

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
      "category": "personal",
      "name": "groceries",
      "description": "Pick up kiwi fruit.",
      "isComplete": "false"
    },
    {
      "id": String(uuid()),
      "category": "personal",
      "name": "groceries",
      "description": "Pick up kiwi fruit.",
      "isComplete": "false"
    }
  ];

module.exports = config;