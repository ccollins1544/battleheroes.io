const db = require("../models");

// Defining methods for the gameController
module.exports = {
  
  // POST /api/game/:user_id
  startGame: function (req, res) {
    let instigator_id = req.params.user_id;
    let { instigator_hero_id, instigator_hero_hp } = req.body;
    let players = [ instigator_id ];
    let heroes = [ instigator_hero_id ];

    db.Game.findOne({
      instigator_id: instigator_id,
      in_game: true,
    })
    .then(inGame => {
      if(inGame){
        return inGame;
      }

      return db.User.findOne(
        { '_id': instigator_id },
        {
          active_game: 1
        }
      ).then(money => console.log("MONEY", money)).catch(err => res.status(422).json(err));

    })
    .then(userResponse => {
      
      if(userResponse){
        return db.Game.findOne(
          { '_id': userResponse.active_game }
        )
        .catch(err => res.status(422).json(err));
      }

      let newGame = {
        instigator_id, 
        instigator_hero_id, 
        instigator_hero_hp,
        players,
        heroes, 
        in_game: false,
        turn_count: 0,
      };

      return db.Game.create(newGame).catch(err => res.status(422).json(err))
    })
    .then(startedGame => {

      db.User.find({
        '_id': startedGame.instigator_id,
        'games': startedGame._id
      }).then(wasStarted =>{
        if(wasStarted.length === 0 ){
          db.User.findOneAndUpdate(
            { '_id': startedGame.instigator_id },
            { 
              $push: { 'games': startedGame._id },
              $set: { 
                'active_game': startedGame._id, 
                'game_status': 1, 
                'hero': startedGame.instigator_hero_id 
              }
            },
            { new: true }
          )
          .then(dbModel => console.log("updated users game and game_status", dbModel));
        }
      });

      return startedGame;
    })
    .then(startedGame => res.json(startedGame))
    .catch(err => res.status(422).json(err));
  },

  // Matches: GET /api/game/challenge
  /**
   * get players available 0,1
   * detect if you've been challenged ***
   * detect if rival accepted 2,3
   * something for game_status 3
   */
  searchChallenge: function (req, res) {
    console.log("searchChallenge");
    let { user_id } = req.body;

    db.User.find({
      $and : [
        { $or: [
          { 'game_status': { $in: [ 0, 1 ] } }, 
          { 'game_status': { $exists: false } }
        ]},
        {
          '_id': { $ne: user_id }
        }
      ]
    })
    .then(dbPlayers => res.json(dbPlayers))
    .catch(err => res.status(422).json(err));
  },

  findById: function (req, res) {
    console.log("findbyid");
    db.Game.findOne({
      _id: req.params.game_id
    })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  // PATCH /api/game/pending
  pendingRival: function(req, res){
    console.log("pending Rival", req.body);
    let { games, my_id } = req.body;
    if(games && my_id ){
      db.User.find({
        $and : [
          { 'games' : games },
          { '_id': { $ne: my_id } }
        ]
      })
      .then(dbPending => res.json(dbPending))
      .catch(err => res.status(422).json(err));
    }else{
      res.status(200).send("No Pending Rivals Found!");
    }
  },

  // POST /api/game/pending/possible
  myPendingGame: function(req, res){
    let { games, my_id } = req.body;
    if( games && my_id ){
      db.User.find({
        $and : [
          { 'games' : games },
          { '_id': my_id }
        ]
      },
      {
        'games': 1, '_id': 0, 'active_game': 1
      }).then(userGamesResponse => {
        let { games, active_game } = userGamesResponse[0];
        let possibleGameInvites;

        games.forEach(element => {
          if(active_game !== element){
            possibleGameInvites = element;
          }
        });
        
        return possibleGameInvites;
      }).then(possibleGameInvites => {
        db.Game.findOne({
          _id: possibleGameInvites
        })
        .then(dbPossible => res.json(dbPossible))
        .catch(err => res.status(200).send("No Possible Games Found!"));
      }).catch(err => res.status(422).json(err));

    }else{
      res.status(200).send("No Possible Games Found!");
    }
  }

};