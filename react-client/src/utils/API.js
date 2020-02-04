import axios from "axios";

export default {
  getUser: () => axios.get('/user'),
  register: registerData => axios.post('/user', registerData),

  login: loginData => axios.post('/user/login', loginData),
  logout: () => axios.post('/user/logout'),

  // getAllHeroes: () => axios.get('./_heroes.json'),
  getAllHeroes: () => axios.get('/api/heroes'),
  getHeroBySlug: slug => fetch('/api/heroes/' + slug),
  getHeroById: hero_id => fetch('/api/hero/' + hero_id),

  getUserById: user_id => axios.get('/user/' + user_id),
  sendEmail: messageData => axios.post('/api/sendemail', messageData),

  startGame: (user_id, heroData) => axios.post('/api/game/' + user_id, heroData),
  searchChallenge: user_id => axios.get('/api/game/challenge', user_id),
};
