let config = require("./config");

let {CosmosClient} = require("@azure/cosmos");
// let uriFactory = require('documentdb').UriFactory;

const masterKey = config.primaryKey;


const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

const HttpStatusCodes = {NOTFOUND: 404};
const databaseId = config.database.id;
const containerId = config.container.id;


const database = getDatabase();
const container = getContainer();

// .then(() => insertDocuments())
// //.then(() => getToDoDoc(config.documents.groceries))
//   .then(() => {
//     console.log(`Completed successfully`)
//   })
//   .catch((error) => {
//     console.log(`Completed with error ${JSON.stringify(error)}`)
//   });


function getDatabase() {

  console.log(`Getting database: ${databaseId}`);

  return client.database(databaseId)

}

async function getContainer() {

  console.log(`Getting container: ${containerId}`);

  const {body: container} = await database.container(containerId).read();
  return container;

};

function getToDoDoc(document) {

  console.log(`Getting document: ${document.id}`);

  let documentUrl = uriFactory.createDocumentUri(databaseId, containerId, document);

  return new Promise((resolve, reject) => {

    client.readDocument(documentUrl, (err, result) => {

      if (err) {
        if (err.code == HttpStatusCodes.NOTFOUND) {

          let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, containerId);

          client.createDocument(collectionUrl, document, (err, created) => {
            if (err) reject(err)
            else resolve(created);
          });

        } else {
          reject(err);
        }

      } else {
        resolve(result);
        console.log(result);
      }
    });
  });


};

function insertDocuments() {

  console.log('Inserting documents');

  try {

    config.documents.forEach(async (currentDoc) => {

      console.log('==================== INSERT ====================');
      console.log(currentDoc.id);

      const {item: item} = await container.items.create(currentDoc);

      console.log(item);

    });

  } catch (e) {
    console.error(e);
  }
}



