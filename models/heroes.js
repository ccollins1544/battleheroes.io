const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const heroSchema = new Schema({
  name: String,
  slug: String,
  image: String,
  hp: Number,
  attack1_dmg: Number,
  attact2_dmg: Number,
  attack1_description: String,
  attack2_description: String, 
  enabled: Boolean,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date, 
    default: Date.now
  }

});

const Heroes = mongoose.model("Heroes", heroSchema);

module.exports = Heroes;
