const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('cctvcamera_products');
        const productsCollection = database.collection('products');
        const ordersCollection= database.collection("orders");

           // get api  
           app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        });

          //  get single product api 
        app.get('/products/:id',async(req,res)=>{
          const id = req.params.id;
          const query = { _id:ObjectId(id) };
          const product = await productsCollection.findOne(query);
          res.json(product);

          });


          
    //post order api 
  app.post("/orders", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  ///get  all orders
  app.get("/orders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });
  //Get single user orders
  app.get('/myOrders/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const order = await ordersCollection.find(query).toArray();
    res.send(order)
});

 //Delete Order
 app.delete('/orderDelete/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await ordersCollection.deleteOne(query);

  res.json(result)
 });
  


             // post api 
    app.post('/products',async(req,res)=>{
        const product = req.body;
        const result =await productsCollection.insertOne(product);
        res.json(result)
    });

        
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('cctv camera server is running!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})