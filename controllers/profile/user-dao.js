import userModel from "./user-model.js"; 


export const createUser = async (user) =>
     await userModel.create(user);

export const findUserByUsername = async (username) =>
     await userModel.findOne({username})

export const findUserByCredentials = (username, password) =>
    userModel.findOne({username,password});
export const updateUser = async (uid, user) => {
     return userModel.updateOne({_id: uid}, user);
     }

export const findUsers = async () => 
     await userModel.find();


export const deleteUser = async (uid) => 
    userModel.deleteOne({_id: uid})







