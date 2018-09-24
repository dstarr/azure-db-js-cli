let config = {};

config.endpoint = "https://node-cosmos.documents.azure.com:443/";
config.primaryKey = "1bDa0iCNSkpmHRrxtyvQRBsRIrJsSJzcA5kpixy0sTRdRM5cqAk0yLHStcORYC2NCR6EGIh272GJTJfIZBUi7g==";

config.database = {
  "id": "ToDoList"
};

config.collection = {
  "id": "Items"
};

config.documents = {

  "groceries1": {
    "id" : "id3",
    "category" : "personal",
    "name" : "groceries",
    "description" : "Pick up kiwi fruit.",
    "isComplete"  : false
  },
  "groceries2": {
    "id" : "id4",
    "category" : "personal",
    "name" : "groceries",
    "description" : "Pick up orange fruit.",
    "isComplete"  : false
  }
};



module.exports = config;