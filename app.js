const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const uuid = require('uuid');
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

let docId = null;

// The addNewDocs executes on it's own thread so quickly the deleteAllDocs
// This means designing for eventual consistenty
addNewDocs()
  //.then(() => listAll())
  //.then(() => deleteAllDocs())
  .then(() => addOneDoc())
  .then(() => fetchOneDocument())
  .catch((err) => {
    if (err)
      console.error(err);
  });

async function fetchOneDocument() {

  console.log(`FETCHING: ${docId}`);

  const query = `select * from i where i.id = '${docId}'`;

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  const {result: items} = await container.items.query(query).toArray();

  if (items.length !== 1)
    console.error(`GOT ${items.length} BACK`);
  else
    console.log(`RECEIVED: ${docId}`);
}

// This means the delete doesn't typically actually delete all the docs.
async function addOneDoc() {

  docId = uuid();

  const doc = {
    id: docId,
    content: "Would that I had another lifetime to spend with her in love."
  };

  await addItem(doc);

}

async function addNewDocs() {

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});

  const p = [];

  console.log("INSERTING 100 DOCS");
  for (i = 0; i < 100; i++) {

    const id = uuid();
    let doc = {id: id, content: `The id of this document is: ${id}`};
    p.push(container.items.create(doc));
  }

  await Promise.all(p);
  console.log("DONE INSERTING 100 DOCS");


}

async function addItem(item) {

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});

  console.log("ADDING: " + item.id);
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


