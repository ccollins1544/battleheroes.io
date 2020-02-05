const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({  
  instigator_id: Schema.Types.ObjectId,
  instigator_hero_id: Schema.Types.ObjectId,
  instigator_hero_hp: Number,
  rival_id: Schema.Types.ObjectId,
  rival_hero_id: Schema.Types.ObjectId,
  rival_hero_hp: Number,
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  heroes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Heroes"
    }
  ],
  turn_count: Number,
  player_turn: Schema.Types.ObjectId,
  in_game: Boolean
},
{
  timestamps: true
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
