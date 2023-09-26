import * as usersDao from  './user-dao.js' ;
import {findUserByUsername} from "./user-dao.js";

const updateUser = async (req, res) => {
    const uid = req.params.uid;
    const user = req.body;

    try {
        console.log('uid in  update user is', uid);
        const status = await usersDao.updateUser(uid, user);

        // Retrieve the updated user data from the database
        const updatedUser = await usersDao.findUserById(uid); // Replace with your actual function

        // Update req.session["currentUser"] with the updated user data
        req.session["currentUser"] = updatedUser._doc;

        res.json(status);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Assume that usersDao.updateUser function handles errors and returns the status accordingly.


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
    //console.log('called login on server', username, password);
    const user = await usersDao
        .findUserByCredentials(username, password);
    if (user) {
     // setting logged-in user as current user
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
    // Create a new object by excluding the 'password' field
    const user = await usersDao.findUserById(currentUser._id);
    const userData = user._doc;

    const sanitizedUser = { ...userData };
    console.log("profile on backend", sanitizedUser);
    delete sanitizedUser.password;
    // Send the modified object as JSON response
    res.json(sanitizedUser);
  };
const addToWatchlist = async (req, res) => {
    console.log("called addToWatchList");
    const currentUser = req.session["currentUser"];
    // is this user logged in?
    if (!currentUser) {
        console.log("user not logged in");
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const movieToAdd = req.body;
    console.log('movieToAdd', movieToAdd);

    try {
        console.log('now trying to update watchlist of', currentUser._id);

        // Find the user by their ID
        const user = await usersDao.findUserById(currentUser._id);
        console.log('user found', user);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            console.log("user authenticated, but not found in database")
            return;
        }

        // Add the movie to the user's watchlist
        user.watchlist.push(movieToAdd);

        // Prepare an object with only the watchlist field to update
        const updatedFields = { watchlist: user.watchlist };

        // Convert the _id to a string
        const userIdString = currentUser._id.toString();

        // Use the updateUser method to update the user document
        const result = await usersDao.updateUser(userIdString, updatedFields);
        console.log("updateUser result", result);

        res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteFromWatchlist = async (req,res) => {
    const currentUser = req.session["currentUser"];
    // is this user logged in?
    if (!currentUser) {
        console.log("user not logged in");
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    // Assume req.params.movieId contains the _id of the movie to be removed
    const movieIdToRemove = req.params.mid;

    try {
        // Find the user by their ID
        const user = await usersDao.findUserById(currentUser._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use Array.filter to create a new watchlist without the movie to remove
        user.watchlist = user.watchlist.filter(movie => movie.movieId !== movieIdToRemove);
        const updatedFields = { watchlist: user.watchlist };
        console.log('updatedFields', updatedFields);

        // Save the updated user document
        const result = await usersDao.updateUser(currentUser._id, updatedFields);

        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


}

const UsersController = (app) => {
    app.post('/api/users/register', createUser);
    app.get('/api/users/all', findUsers)
    app.get('/api/users/:uid', findUserByUsername);
    app.put('/api/users/:uid', updateUser);
    app.delete('/api/users/:uid', deleteUser);
    app.post('/api/users/login', login)
    app.post('/api/users/profile', profile);
    app.post('/api/users/logout', logout);
    app.post('/api/users/add-to-watchlist', addToWatchlist);
    app.delete('/api/users/watchlist/:mid', deleteFromWatchlist)
}
export default UsersController;





