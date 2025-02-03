const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Mongodb configuration
const uri = 'mongodb://localhost:27017';

// const uri = "mongodb+srv://afsarhossain:<db_password>@cluster0.b6ov8m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // const database = client.db('usersDB');
    // const userCollection = database.collection('users');

    const userCollection = client.db('usersDB').collection('users');


    // Get all users
    app.get('/users', async (req, res) => {
         const cursor = userCollection.find();
         const result = await cursor.toArray();
         res.send(result); 
    })

    // Get Specific user by id
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    // Create a new user
    app.post('/users', async(req, res) => {
        const user = req.body;
        console.log('New user: ', user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    // Update a user in the collection
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log('Update user: ', user);

      const filter = {_id: new ObjectId(id)};
      const operations = {upsert: true};
      const updatedUser = {
        $set : {
          name: user.name,
          email: user.email
        }
      }

      const result = await userCollection.updateOne(filter, updatedUser, operations);
      res.send(result);
    })

    // Delete a user from the collection
    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      console.log('Please delete a user from the collection: ', id);
      const query = {_id: new ObjectId(id)};

      const result = await userCollection.deleteOne(query);
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
    res.send("Welcome to CRUD Operation.")
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})
