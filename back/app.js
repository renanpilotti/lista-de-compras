const express = require('express');
const app = express();
var cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const client = new MongoClient('mongodb+srv://rmpilotti:merengues@cluster0.vt2cn1x.mongodb.net/?retryWrites=true&w=majority')

let array = [];

app.post('/lista', (req, res) => {
    async function addItem() {
        try {
            await client.connect();
    
            const db = client.db('todo').collection("items");
    
            const item = req.body;
    
            array.push(item)
    
            const p = await db.insertOne(item)
    
            res.send(item);
        }
        finally {
            await client.close();
        }
    }
    addItem().catch(console.dir);
})

app.get('/lista', async (req, res) => {
    if (array.length === 0) {
        async function getData() {
            try {
                await client.connect();

                const db = client.db('todo').collection("items");
                const myDoc = await db.find().forEach(item => array.push(item))
                res.json(array);
            } catch (err) {
                console.log(err.stack);
            }
            finally {
                await client.close();
            }
        }
        getData().catch(console.dir);
    } else {
        res.json(array)
    }
})

app.listen('5000', () => console.log('port 5000 initiated'))