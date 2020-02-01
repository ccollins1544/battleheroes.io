const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const heroSchema = new Schema({
  name: String,
  description: String,
  image: String
});

const Heroes = mongoose.model("Heroes", heroSchema);

module.exports = Heroes;
