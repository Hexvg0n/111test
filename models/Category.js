import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nazwa kategorii jest wymagana'],
    unique: true, // Tylko tutaj definiujemy unikalność
    minlength: [2, 'Nazwa musi mieć przynajmniej 2 znaki'],
    maxlength: [50, 'Nazwa może mieć maksymalnie 50 znaków']
  }
}, {
  timestamps: true
})

// Usunięto ręczne tworzenie indeksu
export default mongoose.models.Category || mongoose.model('Category', CategorySchema)