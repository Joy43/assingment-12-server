const express = require('express');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
// const axios = require('axios');
const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
 require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

// ---------------middleware--------------
app.use(cors());
app.use(express.json());
// 5jGfXyoPOlyhPqTg
const uri = "mongodb+srv://assingment12:57XBCL4ql0uKw9O5@cluster0.bpfhrgu.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://tech12:5jGfXyoPOlyhPqTg@cluster0.ptcqcbq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
client.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
async function run() {
  try {
  

// -------------connect  bd--------------
const productCollection = client.db("tech").collection("product");
const cartCollection=client.db("tech").collection("carts");
const userCollection=client.db("tech").collection("users");

// ------------------user reated-----------------

  // use verify admin after verifyToken
    // const verifyAdmin = async (req, res, next) => {
    //   const email = req.decoded.email;
    //   const query = { email: email };
    //   const user = await userCollection.findOne(query);
    //   const isAdmin = user?.role === 'admin';
    //   if (!isAdmin) {
    //     return res.status(403).send({ message: 'forbidden access' });
    //   }
    //   next();
    // }
// ----------------------get user--------------------
//  app.get('/users/admin/:email', async (req, res) => {
//       const email = req.params.email;

//       if (email !== req.decoded.email) {
//         return res.status(403).send({ message: 'forbidden access' })
//       }

//       const query = { email: email };
//       const user = await userCollection.findOne(query);
//       let admin = false;
//       if (user) {
//         admin = user?.role === 'admin';
//       }
//       res.send({ admin });
//     })

app.get('/users',async(req,res)=>{
  const result=await userCollection.find().toArray();
  res.send(result);
})
// --------post user------
app.post('/users', async (req, res) => {
  const user = req.body;
  const query = { email: user.email }
  const existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: 'user already exists', insertedId: null })
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});

// ----------patch admin------------

  app.patch('/users/admin/:id', verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    //---------------- user delete--------
    app.delete('/users/:id',async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    

// -----------  product -----------
app.get('/product',async (req,res) => {
   const result = await productCollection.find().toArray();
    res.send(result);
  
  });

// -----------------cart collection--------------
 // carts collection
 app.get('/carts', async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result);
});

app.post('/carts', async (req, res) => {
  const cartItem = req.body;
  const result = await cartCollection.insertOne(cartItem);
  res.send(result);
});

app.delete('/carts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})


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
