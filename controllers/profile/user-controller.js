import * as usersDao from  './user-dao.js' ;
import {findUserByUsername} from "./user-dao.js";

const updateUser = async (req, res) => {
    const uid = req.params.uid;
    const user = req.body;

    try {
        console.log('uid in  update user is', uid);
        const status = await usersDao.updateUser(uid, user);

        // Retrieve the updated user data from the database
        const updatedUser = await usersDao.findUserById(uid);

        const userData = updatedUser._doc;

        const sanitizedUser = { ...userData };
        delete sanitizedUser.password;

        res.json(sanitizedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    const uid = req.params.uid;
    const status = await usersDao.deleteUser(uid);
    res.json(status);
}
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
const getBaseProfileByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await usersDao.findUserByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //console.log('user in getBaseProfile', user)
        const userId = user._id;

        try {
            // first page of followers to display on profile
            const followers = await usersDao.findFollowersOfUserById(userId);
            // first page of people this user is following
            const following = await usersDao.findFollowingListByUserId(userId);
            // number of followers this user has total
            const followersCount = await usersDao.getNumberofFollowersByUserId(userId);
            // number of people this user is following total
            const followingCount = await usersDao.getNumberofFollowingByUserId(userId);

            const userData = user._doc;

            // Sanitize user data
            const sanitizedUser = { ...userData };
            delete sanitizedUser.password;
            delete sanitizedUser.email;
            delete sanitizedUser.dateOfBirth;

            // Add followers to the user data and counts
            sanitizedUser.followers = followers;
            sanitizedUser.following = following;
            sanitizedUser.followersCount = followersCount
            sanitizedUser.followingCount = followingCount


            // Return the sanitized user data
            res.json(sanitizedUser);
        } catch (followersError) {
            console.error('Error fetching followers:', followersError);
            res.status(500).json({ error: 'Error fetching followers' });
        }
    } catch (error) {
        console.error('Error fetching base profile by username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


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
    delete sanitizedUser.password;
    // Send the modified object as JSON response
    res.json(sanitizedUser);
  };
const addToWatchlist = async (req, res) => {

    const currentUser = req.session["currentUser"];
    // is this user logged in?
    if (!currentUser) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const movieToAdd = req.body;
    try {
        // Find the user by their ID
        const user = await usersDao.findUserById(currentUser._id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
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

        res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getUserWatchlistByUsername = async (req,res) => {
    try {
        const username = req.params.username; // Assuming 'username' is a property of req.params

        const user = await usersDao.findUserByUsername(username);

        if (!user) {
            // If user is not found, return an error response
            return res.status(404).json({error: 'User not found'});
        }
        const data = {username: user.username,
            profilePic: user.profilePic,
            watchlist: user.watchlist
        }

        res.json(data);
    }catch (error){
        console.log(error)
    }
}
const getFavoritesByUsername = async (req,res) => {
    try {
        const username = req.params.username; // Assuming 'username' is a property of req.params
        const user = await usersDao.findUserByUsername(username);

        if (!user) {
            // If user is not found, return an error response
            return res.status(404).json({error: 'User not found'});
        }
        const data = {username: user.username,
            profilePic: user.profilePic,
            favoriteMovies: user.favoriteMovies
        }
        res.json(data);
    }catch (error){
        console.log(error)
    }
}
const addToFavorites = async (req,res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        console.log("user not logged in");
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const movieToAdd = req.body;
    try {
        // Find the user by their ID
        const user = await usersDao.findUserById(currentUser._id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            console.log("user authenticated, but not found in database")
            return;
        }
        // Add the movie to the user's watchlist
        user.favoriteMovies.push(movieToAdd);

        // Prepare an object with only the favorites field to update
        const updatedFields = { favoriteMovies: user.favoriteMovies };

        // Convert the _id to a string
        const userIdString = currentUser._id.toString();

        // Use the updateUser method to update the user document
        const result = await usersDao.updateUser(userIdString, updatedFields);
        res.json(movieToAdd);

    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteFromFavorites = async (req,res) => {
    const currentUser = req.session["currentUser"];
    // is this user logged in?
    if (!currentUser) {
        console.log("user not logged in");
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const movieIdToRemove = req.params.mid;

    try {
        // Find the user by their ID
        const user = await usersDao.findUserById(currentUser._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use Array.filter to create a new watchlist without the movie to remove
        user.favoriteMovies = user.favoriteMovies.filter(movie => movie.movieId !== movieIdToRemove);
        const updatedFields = { favoriteMovies: user.favoriteMovies };
        // Save the updated user document
        const result = await usersDao.updateUser(currentUser._id, updatedFields);
        res.status(200).json({ message: 'Movie removed from favorites' });
    } catch (error) {
        console.error('Error removing movie from favorites:', error);
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
            return res.status(404).json({ error: 'User not found while removing from watchlist' });
        }
        // Use Array.filter to create a new watchlist without the movie to remove
        user.watchlist = user.watchlist.filter(movie => movie.movieId !== movieIdToRemove);
        const updatedFields = { watchlist: user.watchlist };

        // Save the updated user document
        const result = await usersDao.updateUser(currentUser._id, updatedFields);
        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getUserFollowingList = async (req,res) => {
    // this function gets all the people that the user in params is FOLLOWING
    try {
        const userId = req.params.uid;
        const followingList = await usersDao.findFollowingListByUserId(userId)
            .populate('following', ['username', 'profilePic'])

        res.json(followingList);
    }catch (error){
        console.log(error)
    }
}
const getFollowersList = async (req,res) => {
    // this function gets all the people that FOLLOW the user in params
    try {
        const userId = req.params.uid;
        const followersList = await usersDao.findFollowersOfUserById(userId)
            .populate('follower', ['username', 'profilePic'])

        res.json(followersList);
    }catch (error){
        console.log(error)
    }
}
const checkForFollowRelationship = async (req,res) => {
    try {
        const userId = req.params.userId;
        const targetUserId = req.params.targetUserId;

        const result = await usersDao.checkForFollowRelationship(userId, targetUserId);

        if (result) {
            res.json({follows: true})
        }
        else {
            res.json({follows: false})
        }
    }catch(error) {
        console.log(error)
    }
}
// creating a follow relationship
const followUser = async (req,res) => {
    const currentUser = req.session["currentUser"];
    // is this user logged in?
    if (!currentUser) {
        console.log("user not logged in");
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const relationship = req.body;
    try {
        const  insertedRelationship = await usersDao.createFollowRelationship(relationship)
        res.json(insertedRelationship);
    }catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const unfollowUser = async (req, res) => {
    const currentUser = req.session["currentUser"];

    // Check if the user is logged in
    if (!currentUser) {
        console.log("User not logged in");
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.params.userId;
    const targetUserId = req.params.targetUserId;

    try {
        // Check if the follow relationship exists
        const followObject = await usersDao.checkForFollowRelationship(userId, targetUserId);

        if (followObject) {
            // If it exists, delete the follow relationship
            await usersDao.deleteFollowRelationship(followObject._id);
            res.status(200).json({ success: true });
        } else {
            // If the follow relationship doesn't exist, return failure status
            res.status(404).json({ error: 'Follow relationship not found' });
        }
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const UsersController = (app) => {
    app.post('/api/users/register', createUser);
    app.get('/api/users/all', findUsers);
    app.get('/api/users/:username/base-profile', getBaseProfileByUsername);
    app.get('/api/users/:uid', findUserByUsername);
    app.get('/api/users/:username/watchlist', getUserWatchlistByUsername)
    app.get('/api/users/:username/favorites', getFavoritesByUsername)
    app.put('/api/users/:uid', updateUser);
    app.delete('/api/users/:uid', deleteUser);
    app.post('/api/users/login', login)
    app.post('/api/users/profile', profile);
    app.post('/api/users/logout', logout);
    app.post('/api/users/add-to-watchlist', addToWatchlist);
    app.post('/api/users/add-to-favorites', addToFavorites);
    app.delete('/api/users/watchlist/:mid', deleteFromWatchlist)
    app.delete('/api/users/favorites/:mid', deleteFromFavorites)
    app.get('/api/users/:uid/followers', getFollowersList)
    app.get('/api/users/:uid/following', getUserFollowingList)
    app.get('/api/users/:userId/follows/:targetUserId', checkForFollowRelationship);
    app.post('/api/users/follow',followUser)
    app.delete('/api/users/:userId/unfollow/:targetUserId',unfollowUser);
}
export default UsersController;





