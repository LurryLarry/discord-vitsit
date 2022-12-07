const { mongoose } = require('mongoose');
const { dbToken } = process.env;

mongoose.connect(dbToken)
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.log(err));

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

const jokeSchema = new mongoose.Schema({
  joke: String,
  date: Date,
  author: String
});

jokeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})
console.log('test')

const Joke = mongoose.model('Joke', jokeSchema);

module.exports = { Joke };