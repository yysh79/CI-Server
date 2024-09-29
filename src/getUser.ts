const express = require('express');
const mongodb = require('mongodb');
const app = express();
const uri = "mongodb+srv://itzik:bYnEFZURqJUjCfS4@cluster0.mfi9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new mongodb.MongoClient(uri);

async function main() : Promise<void> {

    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const database = client.db('dataBase');
        const collection = database.collection('users');

        app.get('/users', async (req, res) => {
            try {
                const users = await collection.find().toArray();
                res.json(users);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).send('Error fetching users');
            };
        });
        app.listen(3000, ()=> console.log('Server is running on port 3000'));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
main().catch(console.error)



