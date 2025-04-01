import mongoose from 'mongoose'

// models/Product.js
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: {
    type: Number,
    set: v => typeof v === 'string' ? parseFloat(v.replace(/,/g, '.')) : v,
    validate: {
      validator: Number.isFinite,
      message: 'Nieprawidłowa wartość liczbowa dla pola {PATH}'
    }
  },
  category: String,
  image: String,
  buyLink: String
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)