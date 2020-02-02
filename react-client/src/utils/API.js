import axios from "axios";

export default {
  user: () => axios.get('/user'),
  register: registerData => axios.post('/user', registerData),

  login: loginData => axios.post('/user/login', loginData),
  logout: () => axios.post('/user/logout'),

  getAllHeroes: () => axios.get('./heroes.json'),  // fetch('/api/heroes')
  getUserById: user_id => axios.get('/user/' + user_id),

  sendChallenge: messageData => axios.post('/api/sendemail', messageData)
};
