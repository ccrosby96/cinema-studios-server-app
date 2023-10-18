import userModel from "./user-model.js";
import followModel from "./follow-model.js";

export const findFollowingListByUserId = async (userId, page = 1, pageSize = 30) => {
     const skip = (page-1) * pageSize
     // who is this user following?
     return followModel.find({follower: userId})
         .skip(skip)
         .limit(pageSize)
         .populate('following', ['username', 'profilePic']);
}
// get list of people following this user
export const findFollowersOfUserById = async (userId, page = 1, pageSize = 30) => {
     const skip = (page - 1) * pageSize;
     // who follows this user?
     return followModel.find({ following: userId })
         .skip(skip)
         .limit(pageSize)
         .populate('follower', ['username', 'profilePic']);
}
export const getNumberofFollowersByUserId = async (userId) => {
     return followModel.countDocuments({following: userId});
}
export const getNumberofFollowingByUserId = async (userId) => {
     return followModel.countDocuments({follower: userId});
}

export const checkForFollowRelationship = async (follower, following) => {
     try {
          const result = await followModel.findOne({ follower: follower, following: following });
          return result;
     } catch (error) {
          console.error("Error in checkForFollowRelationship:", error);
          throw error; // Rethrow the error to be caught by the calling function
     }
};
export const createFollowRelationship = async (relationship) => {
     try {
          return await followModel.create(relationship)
     }catch (error){
          console.log(error)
     }
}
export const deleteFollowRelationship = async (relationshipId) => {
     try {
          return await followModel.deleteOne({_id: relationshipId})
     }catch (error){
          console.log(error)
     }
}


export const createUser = async (user) =>
     await userModel.create(user);

export const findUserByUsername = async (username) => {
     return await userModel.findOne({username})
}

export const findUserById = async (userId) => {
     return await userModel.findById(userId);
}
export const findUserByCredentials = (username, password) =>
    userModel.findOne({username,password});
export const updateUser = async (uid, user) => {
     return userModel.updateOne({_id: uid}, user);
     }

export const findUsers = async () => 
     await userModel.find();


export const deleteUser = async (uid) => 
    userModel.deleteOne({_id: uid})







