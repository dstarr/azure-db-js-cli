const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const uuid = require('uuid');
const masterKey = config.accessKey;

const databaseId = config.db.id;
const containerId = config.container.id;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

let docId = null;

addNewDocs()
  .then(() => deleteAllDocs())
  .then(() => addOneDoc())
  .then(() => fetchOneDoc())
  .catch((err) => {
    if (err)
      console.error(err);
  });

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

async function addOneDoc() {

  docId = uuid();

  const doc = {
    id: docId,
    content: "Would that I had another lifetime to spend with her."
  };

  await addSingleDoc(doc);

}

async function addSingleDoc(doc) {

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});

  console.log("ADDING: " + doc.id);
  await container.items.create(doc);
}

async function deleteAllDocs() {

  const queryString = 'select * from items i where i.id != ""';

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  const {result: docs} = await container.items.query(queryString).toArray();

  console.log(`DELETING: ${docs.length} DOCS`);

  let cnt = 0;

  docs.map(async (doc) => {
    cnt++;
    container.item(doc.id).delete(doc);
  });

  console.log(`DELETED: ${cnt} DOCS`);

}

async function fetchOneDoc() {

  console.log(`FETCHING: ${docId}`);

  const query = `select * from i where i.id = '${docId}'`;

  const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await database.containers.createIfNotExists({id: containerId});
  const {result: docs} = await container.items.query(query).toArray();

  if (docs.length !== 1)
    console.error(`GOT ${docs.length} BACK`);
  else
    console.log(`RECEIVED: ${docId}`);
}

