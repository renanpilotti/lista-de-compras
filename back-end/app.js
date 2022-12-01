const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_KEY}@cluster0.vt2cn1x.mongodb.net/?retryWrites=true&w=majority`);

let array = [];

app.get('/', async (req, res) => {

    if (array.length === 0) {
        async function getData() {
            try {
                await client.connect();

                const db = client.db('todo');
                const collection = db.collection("items");

                await collection.find().forEach(item => array.push(item));
                
                res.json(array);
            } catch (err) {
                console.log(err.stack);
            }
            finally {
                await client.close();
            }
        }
        getData().catch(console.log);
    } else {
        res.json(array);
    }
})

app.post('/', (req, res) => {
    async function addItem() {
        try {
            await client.connect();
    
            const db = client.db('todo');
            const collection = db.collection("items");
    
            const item = req.body;
    
            await collection.insertOne(item);

            array.push(item);
            
            res.json(item);
        }
        finally {
            await client.close();
        }
    }
    addItem().catch(console.log);
})

app.delete('/', (req, res) => {
    async function removeAll() {
        try {
            await client.connect();

            const db = client.db('todo');
            const collection = db.collection("items");

            await collection.deleteMany({});
            array = [];
            res.json(array);
        }
        finally {
            await client.close();
        }
    }
    removeAll();
})

app.listen(port, () => console.log(`server running on port ${port}.`));