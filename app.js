const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const uuid = require('uuid');
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

// The addNewDocs executes on it's own thread so quickly the deleteAllDocs
// runs before before insert completes.
// This means the delete doesn't typically actually delete all the docs.
// This means designing for eventual consistenty
// addNewDocs()
//   .then(() => deleteAllDocs())
deleteAllDocs()
  .then(() => listAll())
  .catch((err) => {
    if (err)
      console.error(err);
  });

async function addNewDocs() {

  for (i = 0; i < 100; i++) {

    const id = uuid();

    let doc = {id: id, content: `The id of this document is: ${id}`};

    await addItem(doc)
      .then(() => {
        console.log(`${doc.id} added`);
      })
      .catch((err => {
        console.error(err);
      }));
  }

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

async function listAll() {

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});

  const {result: allDocs} = await container.items.readAll().toArray();

  allDocs.map((doc) => {
    console.log(`DOC IN DB: ${doc.id}`);
  });
}


