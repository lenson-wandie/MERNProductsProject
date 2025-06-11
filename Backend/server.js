import dotenv from 'dotenv';
import express from 'express';
import {connectDB} from './config/DB.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/product.model.js'


const app = express();
const PORT =5000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') })

app.use(express.json());//allows us to accept json data into the req.body

app.get("/", (req, res) => {
  res.send("API is working ✅");
});
app.post("/", async(req,res) =>{
    res.send("Server is Ready")
})


app.post("/api/products",async (req,res)=> {
    const product = req.body; //user will send this data

if(!product.name ||!product.price || !product.image){
    return res.status(400).json({success:false,message:"Please provide all the fields!"})
}

const newProduct = new Product(product)

try {
    await newProduct.save();
    res.status(201).json({success: true , data:newProduct})
} catch (error) {
    console.error("Error in Create Product:", error.message)
    res.status(500).json({success: false, message:"Server Error"})
    
}
});

const startServer = async() =>{
    try {
        console.log("Awaiting DB connection")
        await connectDB();
        console.log("DB connected Successfully")

        app.listen(PORT,()=>{
         console.log(`Server has started from localhost:${PORT}`)
    
})

    } catch (error) {
        console.error("Failed to Start Server", error.message)
        process.exit(1)
    }
}

startServer()
console.log("✅ Server should now be running and accepting requests.");
