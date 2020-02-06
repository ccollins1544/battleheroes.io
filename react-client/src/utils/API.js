import axios from "axios";

export default {
  getUser: () => axios.get('/user'),
  register: registerData => axios.post('/user', registerData),

  login: loginData => axios.post('/user/login', loginData),
  logout: () => axios.post('/user/logout'),

  getAllHeroes: () => axios.get('/api/heroes'),
  getHeroBySlug: slug => axios.get('/api/heroes/' + slug),
  getHeroById: hero_id => axios.get('/api/hero/' + hero_id),
  updateHero: (hero_id, userData) => axios.post('/api/hero/' + hero_id, userData),

  getUserById: user_id => axios.get('/user/' + user_id),
  sendEmail: messageData => axios.post('/api/sendemail', messageData),
  
  startGame: (user_id, heroData) => axios.post('/api/game/' + user_id, heroData),
  searchChallenge: user_id => axios.get('/api/game/challenge', user_id),
  sendChallenge: challengeData => axios.post('/api/sendemail/challenge', challengeData),
  
  getGameById: game_id => axios.get('/api/game/' + game_id),
  getPendingRival: gameData => axios.patch('/api/game/pending', gameData),
};
