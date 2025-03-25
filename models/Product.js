import mongoose from 'mongoose'

// models/Product.js
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    buyLink: String
    // MongoDB automatycznie dodaje pole _id
  })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)