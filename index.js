const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo0ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


//insert document
async function run() {
    try {
        await client.connect();
        const database = client.db("holiday-planner");
        const packageCollection = database.collection("packages");
        const userBookedCollection = database.collection("userBooked")
        const confirmOrderCollection =  database.collection("OrderConfirm")

        //add packages
        app.post("/addPackages", async (req, res) => {
            // console.log(req.body)
            const result = await packageCollection.insertOne(req.body);
            // console.log(result);
            res.send(result)
        })

        //get all packages
        app.get('/addPackages', async (req, res) => {
            const result = await packageCollection.find({}).toArray();
            res.json(result)
        })

        // get clickable package
        app.get('/addPackages/:id', async (req, res) => {
            let id = req.params.id;
            const result = await packageCollection.find({ _id: ObjectId(id)}).toArray();
            res.send(result)
        })

        // post book item
        app.post('/bookItems', async (req, res) => {
            const result = await userBookedCollection.insertOne(req.body);
            res.send(result)
        });

        //get the book item from client page 
        app.get('/bookItems', async (req, res) => {
        const result = await userBookedCollection.find({}).toArray();
             res.json(result)
        })

    //delete items
        app.delete("/bookItems/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const result = await userBookedCollection.deleteOne({_id: req.params.id });
        res.send(result);
  });

        //add Client address and details
        app.post("/confirmBooking", async (req, res) => {
            // console.log(req.body)
            const result = await confirmOrderCollection.insertOne(req.body);
            // console.log(result);
            res.send(result)
        })
        
        //get Client address and details
        app.get('/confirmBooking', async (req, res) => {
        const result = await confirmOrderCollection.find({}).toArray();
             res.json(result)
        })
        // console.log("all are working perfectly");



    } finally {
        // await client.close();
    }
}

//call the function  
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running from Holiday Planner')
})

app.listen(port, () => {
    console.log(`Example app listening at`)
})