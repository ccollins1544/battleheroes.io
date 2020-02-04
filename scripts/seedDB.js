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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
  },
  {
    "name": "Green Ranger",
    "slug": "green-ranger",
    "image": "./img/green-ranger.png",
    "hp": 100,
    "attack1_dmg": 10,
    "attack2_dmg": 20,
    "attack1_description": "Punch",
    "attack2_description": "Kick",
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
    "enabled": true,
    "createdAt": Date.now()
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
