const express = require('express');
const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://assingment12:SVsv9NOeUpkGIidY@cluster0.bpfhrgu.mongodb.net/?retryWrites=true&w=majority";

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
  

// -------------connect  bd--------------
const productCollection = client.db("tech").collection("product");
const cartCollection=client.db("tech").collection("carts");
// -----------product-----------
app.get('/product',async (req,res) => {
   const result = await productCollection.find().toArray();
    res.send(result);
  
  });

// -----------------cart collection--------------
app.post('/carts', async (req, res) => {
  const cartItem = req.body;
  const result = await cartCollection.insertOne(cartItem);
  res.send(result);
});
// -----------get cart-----
app.get('/carts',async (req,res) => {
  const result = await productCollection.find().toArray();
   res.send(result);
 
 });

app.delete('/carts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('tech is sitting on')
  })
  
  app.listen(port, () => {
    console.log(`tech is sitting on port ${port}`);
  })
