const config = require("./config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const masterKey = config.primaryKey;

const client = new CosmosClient({endpoint: config.endpoint, auth: {masterKey: masterKey}});

const databaseid = config.database.id;
const containerId = config.container.id;

async function helloCosmos() {
  const { database } = await client.databases.createIfNotExists( {id: databaseid} );
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  await container.items.create(config.documents[0])

}

helloCosmos()
  .catch((err => {
    console.error(err);
  }));

