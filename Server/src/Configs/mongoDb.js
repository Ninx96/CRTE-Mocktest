const { MongoClient } = require("mongodb");
const config = require("config");

const mongoURI =
  process.env.NODE_ENV == "production"
    ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/?authSource=MockTest`
    : config.get("mongoURI");

let database = null;

async function startDatabase() {
  try {
    // const mongoDBURL = await mongo.getConnectionString();
    console.log(mongoURI);
    const connection = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = connection.db("MockTest");
  } catch (e) {
    console.error(e.message);
  }
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
};

//const cluster = await MongoClient.connect(url);
//cluster.close();
