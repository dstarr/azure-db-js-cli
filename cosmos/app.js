const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const uuid = require('uuid');

const masterKey = config.db.primaryKey;
const client = new CosmosClient({endpoint: config.db.uri, auth: {masterKey: masterKey}});

let db;

setDatabase()
  .then(() => addOneDoc())
  .then(() => deleteAllDocs())
  .then(() => addNewDocs(50))
  .then(() => deleteAllDocs())

  .catch((err) => {
    if (err)
      console.error(err);
  });

const containerId = config.container.id;

async function addNewDocs(num) {

  const p = [];

  console.log(`INSERTING ${num} DOCS`);
  for (let i = 0; i < num; i++) {

    const id = uuid();
    const doc = {id: id, content: `The id of this document is: ${id}`};

    p.push(db.container(containerId).items.create(doc));

  }

  await Promise.all(p);

  console.log(`DONE INSERTING ${num} DOCS`);
}

async function addOneDoc() {

  const docId = uuid();

  const doc = {
    id: docId,
    content: "Would that I had another lifetime to spend with her."
  };

  await addSingleDoc(doc);

}

async function addSingleDoc(doc) {

  //const {database} = await client.databases.createIfNotExists({id: databaseId});
  const {container} = await db.containers.createIfNotExists({id: containerId});

  console.log("ADDING: " + doc.id);
  await container.items.create(doc);
}

async function deleteAllDocs() {

  const queryString = `select * from items`;
  const container = db.container(containerId);

  try {

    let {result: items} = await container.items.query(queryString).toArray();

    for (let i = 0; i < items.length; i++) {

      const deleteResponse = await container.item(items[i].id).delete();
      console.log(`DELETED: ${deleteResponse.item.id}`);

    }

  } catch (err) {
    console.error(err)
  }
}

async function deleteContainer() {

  const container = db.container(containerId);
  await container.delete();

}

async function setDatabase() {

  const {database} = await client.databases.createIfNotExists({id: config.db.id});
  db = database;

  console.log(`DATABASE PRESENT`);


}
