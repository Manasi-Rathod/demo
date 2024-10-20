const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const database = "student";
const client = new MongoClient(url);

const dbConnect = async () => {
    try {
        const result = await client.connect();
        const db = result.db(database);
        return db.collection('profile');
    } catch (error) {
        console.error("Database connection error:", error);
        throw error; // Re-throw the error to handle it upstream
    }
};

module.exports = dbConnect;
