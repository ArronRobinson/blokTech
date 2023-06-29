const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = process.env.MONGO_URL;

// Definieer het schema voor gebruikers
const userSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

// Definieer het schema voor films
const movieSchema = new Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  username: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }
});

// Maak het gebruikersmodel
const User = mongoose.model('User', userSchema);

// Maak het filmmodel
const Movie = mongoose.model('Movie', movieSchema);

// Functie om verbinding te maken met MongoDB
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('One small step for man, a Mongo step for mankind');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Exporteer de modellen en de connect-functie
module.exports = {
  User,
  Movie,
  connect
};
