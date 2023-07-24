const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-rnyf82u-shard-00-00.6nxonq0.mongodb.net:27017,ac-rnyf82u-shard-00-01.6nxonq0.mongodb.net:27017,ac-rnyf82u-shard-00-02.6nxonq0.mongodb.net:27017/?ssl=true&replicaSet=atlas-fxfvty-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const classCollection = client.db("Academiz").collection("Courses");
    const galleryCollection = client.db("Academiz").collection("Gallary");
    const researchCollection = client.db("Academiz").collection("Research");
    const userCollection = client.db("Academiz").collection("user");
    const mycollegeCollection = client.db("Academiz").collection("MyCollege");
    const reviewDataCollection = client.db("Academiz").collection("Review");


    app.get("/courses", async (req, res) => {
      const result = await classCollection.find().limit(3).toArray(); 
      res.send(result);
    });
    app.get("/colleges", async (req, res) => {
      const result = await classCollection.find().toArray(); 
      res.send(result);
    });
    app.get('/coursedetail/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const college = await classCollection.findOne(filter);
      res.send(college)
    })

    app.get('/gallary' , async(req,res) => {
      const result = await galleryCollection.find().toArray();
      res.send(result);
    })
    app.get('/research' , async(req,res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    })
    app.get('/reviewData' , async(req,res) => {
      const result = await reviewDataCollection.find().toArray();
      res.send(result);
    })

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send({ data: result });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user is already exists" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });


    app.get("/mycollege/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { candidateEmail : email };
      const result = await mycollegeCollection.find(filter).toArray();
      res.send({mycolleges : result});  
    });

    app.post("/addCollege", async (req, res) => {
      const newItem = req.body;
      const result = await mycollegeCollection.insertOne(newItem);
      res.send(result);
    });
    

    // Send a ping to confirm a successful connection
    await client.db("Academiz").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running!!");
});

app.listen(port, (req, res) => {
  console.log(`Server is Running on Port : ${port}`);
});
