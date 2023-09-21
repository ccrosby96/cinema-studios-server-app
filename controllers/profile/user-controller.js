import * as usersDao from  './user-dao.js' ;
import {findUserByUsername} from "./user-dao.js";

const updateUser = async (req, res) => {
    const uid = req.params.uid;
    const user = req.body;
    const status = await usersDao.updateUser(uid, user);
    req.session["currentUser"] = req.body;
    res.json(status);
}

const deleteUser = async (req, res) => {
    const uid = req.params.uid;
    const status = await usersDao.deleteUser(uid);
    res.json(status);
}

const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await usersDao
        .findUserByUsername(username)

    if (user) {
        res.sendStatus(409);
        return;
    }
    const newUser = await usersDao
        .createUser(req.body);
    req.session["currentUser"] = newUser;
    res.json(newUser);
};

const createUser = async (req, res) => {
    console.log("called CreateUser on server with user info:", req.body);
    const newUser = req.body;
    newUser.following = 0
    newUser.followers = 0
    newUser.followed = false
    newUser.bio = ""
    newUser.profilePic = "https://tinyurl.com/2kt5w7n7"
    newUser.location = ""
    newUser.dateJoined = new Date()
    newUser.dateOfBirth = new Date()

    const username = req.body.username;
    const user = await usersDao.findUserByUsername(username);
    if (user) {
        console.log("tried to create user that already exists with username ", username);
        res.sendStatus(409);
        return;
      }
      const insertedUser = await usersDao.createUser(newUser);
      console.log("created new user with username ", username);
      //req.session["currentUser"] = insertedUser;
      res.json(insertedUser);
    };

const findUsers = async (req, res) => {
    const users = await usersDao.findUsers();
    res.json(users);
}

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('called login on server', username, password);
    const user = await usersDao
        .findUserByCredentials(username, password);
    if (user) {
     // console.log('found user', user)
      req.session["currentUser"] = user;
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  };  

  const logout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(404);
      return;
    }
    res.json(currentUser);
  };

const UsersController = (app) => {
    app.post('/api/users/register', createUser);
    app.get('/api/users/all', findUsers)
    app.get('/api/users/:uid', findUserByUsername);
    app.put('/api/users/:uid', updateUser);
    app.delete('/api/users/:uid', deleteUser);
    app.post('/api/users/login', login)
    app.post('/api/users/profile', profile);
    app.post('/api/users/logout', logout);
}
export default UsersController;





