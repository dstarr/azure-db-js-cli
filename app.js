let config = require("./config");

let documentClient = require("documentdb").DocumentClient;
let uriFactory = require('documentdb').UriFactory;
let client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseId = config.database.id;
var collectionId = config.collection.id;

function getDatabase() {

  console.log(`Getting database:\n${databaseId}\n`);

  const databaseUrl = uriFactory.createDatabaseUri(databaseId);

  return new Promise((resolve, reject) => {

    client.readDatabase(databaseUrl, (err, result) => {
      if (err) {
        console.log(err.type);
        reject(err);

      } else {
        resolve(result);
      }
    });
  });
}

function getToDoDoc(document) {

  console.log(`Getting document:\n${document.id}\n`);

  let documentUrl = uriFactory.createDocumentUri(databaseId, collectionId, document.id);

  return new Promise((resolve, reject) => {

    client.readDocument(documentUrl, (err, result) => {

      if (err) {
        if (err.code == HttpStatusCodes.NOTFOUND) {

          let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, collectionId);

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

function getCollection() {
  console.log(`Getting collection:\n${collectionId}\n`);
  let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, collectionId);
  return new Promise((resolve, reject) => {
    client.readCollection(collectionUrl, (err, result) => {
      if (err) {
        if (err.code == HttpStatusCodes.NOTFOUND) {
          let databaseUrl = uriFactory.createDatabaseUri(databaseId);
          client.createCollection(databaseUrl, { id: collectionId }, { offerThroughput: 400 }, (err, created) => {
            if (err) reject(err)
            else resolve(created);
          });
        } else {
          reject(err);
        }
      } else {
        resolve(result);
      }
    });
  });
};

getDatabase()
  .then(() => getCollection())
  .then(() => getToDoDoc(config.documents.groceries1))
  .then(() => getToDoDoc(config.documents.groceries1))
  .then(() => {
    console.log(`Completed successfully`)
  })
  .catch((error) => {
    console.log(`Completed with error ${JSON.stringify(error)}`)
  });

