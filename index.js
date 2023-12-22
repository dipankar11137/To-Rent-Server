const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://to_rent:cQT6E9NISbgPDFeV@cluster0.c4hbjgx.mongodb.net/?retryWrites=true&w=majority';


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");
    const userCollection = client.db('toRent').collection('user');
    const flatCollection = client.db('toRent').collection('flats');
    const reviewCollection = client.db('toRent').collection('reviews');
    const bookFlatsCollection = client.db('toRent').collection('bookFlats');

    //   // // // // // // // // // // // //
    //create and update a user
    app.put('/create-user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });
    // // post User
    app.post('/user', async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);
      res.send(result);
    });
    // get User
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // get user by email
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    //                    Flats
    // get flats
    app.get('/flats', async (req, res) => {
      const query = {};
      const cursor = flatCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // post Jobs
    app.post('/flats', async (req, res) => {
      const newFlats = req.body;
      const result = await flatCollection.insertOne(newFlats);
      res.send(result);
    });
    // get one flat filter by id
    app.get('/flat/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await flatCollection.findOne(query);
      res.send(result);
    });
    // all service filter by service category
    app.get('/flats/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category };
      const cursor = flatCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // // Delete flats
    app.delete('/flats/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await flatCollection.deleteOne(query);
      res.send(result);
    });
    // post review
    app.post('/review', async (req, res) => {
      const newFlats = req.body;
      const result = await reviewCollection.insertOne(newFlats);
      res.send(result);
    });
    // get Review
    app.get('/reviews', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //                Book
    // post  book services
    app.post('/bookFlats', async (req, res) => {
      const newProduct = req.body;
      const result = await bookFlatsCollection.insertOne(newProduct);
      res.send(result);
    });
    // // get Book Service
    app.get('/bookFlats', async (req, res) => {
      const query = {};
      const cursor = bookFlatsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // // Delete booking
    app.delete('/bookFlatsDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookFlatsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running To Rent');
});

app.listen(port, () => {
  console.log('To Rent server is running ');
});
