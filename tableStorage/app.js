const azure = require('azure-storage');
const uuid = require('uuid');
const config = require('./config');


createTable();
insertEntities(100);
insertEntitiesWithBatch(100);
// selectSingleEntity
// deleteEntities();
// deleteDataTable

//==================================
// Main functions here
//==================================

function createTable() {

  console.log(`CREATING TABLE: ${config.db.tableName}`);

  getTableService().createTableIfNotExists(config.db.tableName, (error, result) => {

    if (error) {
      console.error(`ERROR CREATING TABLE: ${config.db.tableName}`);
      return undefined;
    }

    if (result.created)
      console.log(`CREATED TABLE: ${config.db.tableName}`);
    else
      console.log(`TABLE ALREADY EXISTED: ${config.db.tableName}`);


  })
}

function insertEntities(num) {

  console.log(`INSERTING ${num} ENTITIES ONE AT A TIME`);

  for (let i = 0; i < num; i++) {

    const entity = makeEntity('insertEntities');

    getTableService().insertEntity(config.db.tableName, entity, (error, result, response) => {

      if (error)
        console.error(error);
    });
  }

  console.log(`INSERTED ${num} ENTITIES ONE AT A TIME`);

}

function insertEntitiesWithBatch(num) {

  console.log(`INSERTING ${num} ENTITIES WITH BATCH`);

  let batch = new azure.TableBatch();

  for (let i = 0; i < num; i++) {
    batch.insertEntity(makeEntity(), {echoContent: false});
  }

  getTableService().executeBatch('DemoApp', batch, function (error, result, response) {
    if (!error) {
      // Batch completed
    }
    else
      console.log('BATCH INSERT COMPLETE');
  });
}

function selectSingleEntity(){};

function deleteEntities(){}

function deleteDataTable() {
  getTableService().deleteTable(config.db.tableName, function (error, response) {
    if (error) {
      console.error(error);
    }
  });
}

//==================================
// Helper functions under here
//==================================


function getTableService() {
  return azure.createTableService(config.db.account, config.db.accessKey);
}

function makeEntity() {

  const id = uuid();

  return {
    PartitionKey: {'_': 'DemoApp'},
    RowKey: {'_': id},
    description: {'_': `This is an entity with id ${id}`}
  };
}

//==================================
// Helper functions under here

