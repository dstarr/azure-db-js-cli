const config = require("./config");
const CosmosClient = require("@azure/cosmos").CosmosClient;
const sleep = require('thread-sleep');

const masterKey = config.primaryKey;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

const databaseId = config.database.id;
const containerId = config.container.id;

addAllDocs()
  .then((err) => {
    if (err)
      console.error(err);
  });

sleep(2000);

deleteAllDocs()
  .then((err) => {
    if (err)
      console.error(err);
  });

async function addAllDocs() {
  config.documents.forEach((doc) => {
    addItem((doc))
      .catch((err => {
        console.error(err);
      }));

    console.log(`-------- INSERTED ${doc.id}`);

  });
}

async function addItem(item) {
  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  await container.items.create(item);
}

async function deleteAllDocs() {

  // const connections = await getConnections();

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  const {result: items} = await container.items.query('select * from root').toArray();

  items.map(async (doc) => {
    container.item(doc.id).delete(doc);
    console.log(`-------- DELETED ${doc.id}`);
  });
}

// async function getConnections() {
//
//   let results = {};
//
//   let { db } = await client.databases.createIfNotExists({id: databaseId});
//   let { c } = await db.containers.createIfNotExists({id: containerId});
//
//   results.database = db;
//   results.container = c;
//
//   return results;
//}

