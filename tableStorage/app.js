const azure = require('azure-storage');
const uuid = require('uuid');
const config = require('./config');


// createTable();

// insertEntities(100);
// insertEntitiesWithBatch(100);
selectSingleEntity();
// deleteEntities();
// deleteTable();

//==================================
// Main functions here
//==================================

function createTable(cb) {

  getTableService().createTableIfNotExists(config.db.tableName, (error, result) => {

    if (error) {
      console.error(`ERROR CREATING TABLE: ${config.db.tableName}`);
      return undefined;
    }

    if (result.created)
      console.log(`CREATED TABLE: ${config.db.tableName}`);
    else
      console.log(`TABLE ALREADY EXISTED: ${config.db.tableName}`);
  });

  cb();
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

  getTableService().executeBatch(config.db.tableName, batch, (error, result, response) => {
    if (error) {
      console.error(error);
    }
    else
      console.log('BATCH INSERT COMPLETE');
  });
}

function selectSingleEntity() {

  const entity = makeEntity();

  //
  // first, insert an entity to retrieve as we will need its id
  //

  getTableService().insertEntity(config.db.tableName, entity, (error, response, getEntity) => {

    if (!error) {
      console.log('INSERTED: ' + entity.RowKey._);
      getEntity();
    } else {
      console.error(error);
    }

  });

  //
  // now select the entity
  //
  function getEntity() {

    console.log('getEntity()');

    getTableService().retrieveEntity(config.db.tableName, entity.RowKey._, '1', function (error, result, response) {
      if (!error) {
        console.log('RETRIEVED: ' + result.entity);
      } else {
        console.error('DID NOT RETRIEVE: ' + entity.RowKey._);
        //console.error(error);
      }
    });

  }
};

function deleteEntities() {

  console.log("DELETING ENTITIES");

  const query = new azure.TableQuery()
    .where('PartitionKey eq ?', 'DemoApp');

  // select all entities
  getTableService().queryEntities(config.db.tableName, query, null, function (error, result, response) {

    if (error) {
      console.error(error);
      return;
    }

    result.entries.forEach(function (entry) {

      getTableService().deleteEntity(config.db.tableName, entry, function (error, response) {
        if (!error) {
          console.log('DELETED: ' + entry.RowKey._);
        }
        else
          console.error(error);
      });


    })

  })
};

function deleteTable() {
  getTableService().deleteTableIfExists(config.db.tableName, function (error, response) {
    if (error)
      console.error(error);
    else
      console.log(`DELETED TABLE: ${config.db.tableName}`);

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
    PartitionKey: {'_': config.db.partitionKey},
    RowKey: {'_': id},
    description: {'_': `This is an entity with id ${id}`}
  };
}

//==================================
// Helper functions under here

