const mongoose = require('mongoose')
// const { MONGODB_CNN } = require('../config');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Se ha establecido la conexión a la base de datos'.bgGreen);

  } catch (err) {
    console.log(err);
    throw new Error('Error en la conexión a la base de datos');
  }
}

module.exports = {
  connectDB,
}