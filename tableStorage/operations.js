const azure = require('azure-storage');
const config = require('./config');


createTable = () => {

  const tableService = getTableService();

  console.log(`CREATING TABLE: ${config.db.tableName}`);

  tableService.createTableIfNotExists(config.db.tableName, (error, result) => {

    if (error) {
      console.error(`ERROR CREATING TABLE: ${config.db.tableName}`);
      return undefined;
    }

    if (result.created)
      console.log(`CREATED TABLE: ${config.db.tableName}`);
    else
      console.log(`TABLE ALREADY EXISTED: ${config.db.tableName}`);


  })
};

insertSomeRecords = () => {

};



//==================================
// Helper functions under here

getTableService = () => {

  console.log('CREATING TABLE SERVICE');
  const tableService = azure.createTableService(config.db.account, config.db.accessKey);
  console.log('CREATED TABLE SERVICE');
  return tableService;

};
