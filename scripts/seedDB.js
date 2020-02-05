require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");

const uri = process.env.MONGODB_URI || "mongodb://localhost/battle_heroes";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Mongo'),
  err => {
    console.log('error connecting to Mongo: ')
    console.log(err);     
  }
);

const user_groups_seed = [
  {
    "group_id": 0,
    "name": "Player",
    "description": "Can access challenge and battle pages."
  },
  {
    "group_id": 1,
    "name": "Admin",
    "description": "Can access all pages."
  },
  {
    "group_id": 2,
    "name": "Beta",
    "description": "Can access beta content."
  },
  {
    "group_id": 3,
    "name": "Inactive",
    "description": "Disabled or inactive account."
  },
];

db.user_groups.remove({})
  .then(() => db.user_groups.collection.insertMany(user_groups_seed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    // process.exit(0);
  })
  .catch(err => {
    console.error(err);
    // process.exit(1);
  });

const game_status_seed = [
  {
    "status_id": 0,
    "name": "Available",
    "description": "Ready to be challenged.",
    "time_limit_minutes": 0
  },
  {
    "status_id": 1,
    "name": "Challenged",
    "description": "Challenged by a player and waiting to accept.",
    "time_limit_minutes": 1440
  },
  {
    "status_id": 2,
    "name": "Accepted",
    "description": "Accepted a challenged and waiting for all players to also accept and ready up for a game.",
    "time_limit_minutes": 15
  },
  {
    "status_id": 3,
    "name": "In_Game",
    "description": "Currently playing a game.",
    "time_limit_minutes": 30
  },
];

db.game_status.remove({})
  .then(() => db.game_status.collection.insertMany(game_status_seed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    // process.exit(0);
  })
  .catch(err => {
    console.error(err);
    // process.exit(1);
  });

const heroesSeed = [
  {
    "name": "Apocalypse",
    "slug": "apocalypse",
    "image": "./img/apocalypse.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Telepathic Strike",
    "attack2_description": "Techno-Organic Machine Gun",
    "enabled": true
  },
  {
    "name": "Donky Kong",
    "slug": "donky-kong",
    "image": "./img/donky-kong.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Barrel Throw",
    "attack2_description": "Ground & Pound",
    "enabled": true
  },
  {
    "name": "Frieza",
    "slug": "frieza",
    "image": "./img/frieza.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Death Comet",
    "attack2_description": "Destroy The Planet!",
    "enabled": true
  },
  {
    "name": "Gengar",
    "slug": "gengar",
    "image": "./img/gengar.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Paralyzing Lick",
    "attack2_description": "Shadow Ball",
    "enabled": true
  },
  {
    "name": "Goke",
    "slug": "goke",
    "image": "./img/goku.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Kamehameha",
    "attack2_description": "Spirit Bomb",
    "enabled": true
  },
  {
    "name": "Green Ranger",
    "slug": "green-ranger",
    "image": "./img/green-ranger.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Dragon Strike",
    "attack2_description": "Dragon Dagger Slash",
    "enabled": true
  },
  {
    "name": "Kid Buur",
    "slug": "kid-buur",
    "image": "./img/kid-buu.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Vanishing Beam",
    "attack2_description": "Continuous Energy Bullets",
    "enabled": true
  },
  {
    "name": "Link",
    "slug": "link",
    "image": "./img/link.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Arrow Barrage",
    "attack2_description": "Master Sword Slash",
    "enabled": true
  },
  {
    "name": "Pikachu",
    "slug": "Pikachu",
    "image": "./img/pikachu.png",
    "hp": 100,
    "attack2_dmg": 20,
    "attack1_dmg": 10,
    "attack1_description": "Iron Tail",
    "attack2_description": "Thunderbolt",
    "enabled": true
  },
  {
    "name": "Samus",
    "slug": "samus",
    "image": "./img/samus.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Charge Shot",
    "attack2_description": "Zero Laser",
    "enabled": true
  },
  {
    "name": "Squirtle",
    "slug": "squirtle",
    "image": "./img/squirtle.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Head Smash",
    "attack2_description": "Hydro Pump",
    "enabled": true
  },
  {
    "name": "The Creech",
    "slug": "the-creech",
    "image": "./img/the-creech.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Metallic Tentacle Melee",
    "attack2_description": "Double Fist Plasma Cannons",
    "enabled": true
  }
];

db.Heroes.remove({})
  .then(() => db.Heroes.collection.insertMany(heroesSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });