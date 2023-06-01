const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = process.env.MONGO_URL;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true}
});

const User = mongoose.model('User', userSchema);

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
  connect
};
