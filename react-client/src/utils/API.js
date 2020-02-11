import axios from "axios";

export default {
  // USER 
  getUser: () => axios.get('/user'),
  getUserById: user_id => axios.patch('/user/' + user_id),
  register: registerData => axios.post('/user', registerData),
  login: loginData => axios.post('/user/login', loginData),
  logout: () => axios.post('/user/logout'),

  // HEROES
  getAllHeroes: () => axios.get('/api/heroes'),
  getHeroBySlug: slug => axios.get('/api/heroes/' + slug),

  // HERO
  updateHero: (hero_id, userData) => axios.post('/api/hero/' + hero_id, userData),
  getHeroById: hero_id => axios.get('/api/hero/' + hero_id),

  // SENDMAIL
  sendEmail: messageData => axios.post('/api/sendemail', messageData),
  sendChallenge: challengeData => axios.post('/api/sendemail/challenge', challengeData),
  
  // GAME
  startGame: (user_id, heroData) => axios.post('/api/game/' + user_id, heroData),
  searchChallenge: user_id => axios.get('/api/game/challenge', user_id),
  getGameById: game_id => axios.get('/api/game/' + game_id),
  getPendingRival: gameData => axios.patch('/api/game/pending', gameData),
  getMyPendingGame: userData => axios.post('/api/game/pending/possible', userData),
  deleteGame: game_id => axios.delete('/api/game/' + game_id),

  // BATTLE
  acceptGame: gameData => axios.post('/api/battle/accept', gameData),
  readyGame: gameData => axios.post('/api/battle/accept/' + gameData.game_id, gameData),
  attackPlayer: gameData => axios.patch('/api/battle/attack', gameData),
 
};
