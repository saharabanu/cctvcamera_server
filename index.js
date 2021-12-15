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