const app = require('./app')

const mongoose = require('mongoose');

const {DB__HOST} = require('./config')

mongoose.set('strictQuery', true)

mongoose.connect(DB__HOST)
  .then(() => {
    app.listen(3000);
      console.log("Server running. Use our API on port: 3000");
      console.log("Database connected success");
    })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })


