const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userGroupsSchema = new Schema({
  group_id: Number,
  name: String,
  description: String,
},
{
  timestamps: true
});

const user_groups = mongoose.model("user_groups", userGroupsSchema);
module.exports = user_groups;

/*
+----------+----------------+--------------+
| group_id | name           | description  |
+----------+----------------+--------------+
|        0 | Player         |              |
|        1 | Admin          |              |
|        2 | Beta Tester    |              |
|        3 | Inactive       |              |
+----------+----------------+--------------+
*/