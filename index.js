const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lbftot.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db("toyCar").collection("products")

        app.post('/addtoy', async (req, res) => {
            const body = req.body;
            console.log(body);
            const result = await productCollection.insertOne(body);
            res.send(result)
        })

        app.get('/toy', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result)
        })

        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, toyName: 1, photo: 1, catagory: 1, price: 1, rate: 1, amount: 1 },
            };
            const result = await productCollection.findOne(query, options)
            res.send(result)
        })

        app.get('/mytoy/:email', async (req, res) => {
            const result = await productCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Toy car is running')
})

app.listen(port, () => {
    console.log(`Port is running on ${port}`);
})