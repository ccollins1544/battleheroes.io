import axios from "axios";

export default {
  user: () => axios.get('/user'),
  register: registerData => axios.post('/user', registerData),

  login: loginData => axios.post('/user/login', loginData),
  logout: () => axios.post('/user/logout'),

  getAllHeroes: () => axios.get('./heroes.json'),  // fetch('/api/heroes')
};
