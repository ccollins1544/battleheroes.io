// helper functions for socket.io 
const users = [];

const addUser = ({ id, user_id, game_id }) => {
  user_id = user_id === undefined ? 0 : user_id.trim().toLowerCase();
  game_id = game_id === undefined ? 0 : game_id.trim().toLowerCase();

  const existingUser = users.find((user) => user.game_id === game_id && user.user_id === user_id);

  if(!user_id || !game_id) return { error: 'user_id and game_id are required.' };
  // if(existingUser) return { error: 'user_id is taken.' }; // crashes when refreshing 

  const user = { id, user_id, game_id };

  users.push(user);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);
const getUsersInGame = game_id => users.filter(user => user.game_id === game_id);

module.exports = { addUser, removeUser, getUser, getUsersInGame };
