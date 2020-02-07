const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameStatusSchema = new Schema({
  status_id: Number,
  name: String,
  description: String,
  time_limit_minutes: Number,
},
{
  timestamps: true
});

const game_status = mongoose.model("game_status", gameStatusSchema);
module.exports = game_status;

/*
+-----------+----------------+-------------+--------------------+
| status_id | name           | description | time_limit_minutes |      |
+-----------+----------------+-------------+--------------------+
|         0 | Available      |             |                    | 
|         1 | Challenged     |             | 1440               |
|         2 | Accepted       |             | 15                 |
|         3 | In_Game        |             | 30                 |
+-----------+----------------+-------------+--------------------+
*/