import mongoose from 'mongoose'

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  description: String,
  image: String
}, { timestamps: true })

export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema)