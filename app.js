const config = require("./config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const masterKey = config.primaryKey;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

const databaseId = config.database.id;
const containerId = config.container.id;

// The addNewDocs executes on it's own thread so quickly the deleteAllDocs
// runs before before insert completes.
// This means the delete doesn't typically actually delete all the docs.
// This means designing for eventual consistenty
addNewDocs()
  .then(() => deleteAllDocs())
  .catch((err) => {
    if (err)
      console.error(err);
  });

async function addNewDocs() {

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

  const queryString = 'select * from items i where i.id != ""';

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  const {result: items} = await container.items.query(queryString).toArray();

  console.log('TOTAL ITEMS RETURNED: ' + items.length);

  items.map(async (doc) => {
    container.item(doc.id).delete(doc);
    console.log(`-------- DELETED ${doc.id}`);
  });
}
