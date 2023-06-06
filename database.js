const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = process.env.MONGO_URL;

const userSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true},
  password: { type: String, required: true },
  watchlist: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

const movieSchema = new Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  username: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5}
});


const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('one small step for man, a mongo step for mankind');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = {
  User,
  Movie,
  connect
};