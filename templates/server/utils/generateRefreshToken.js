import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export default async function(userID) {
    const token = await jwt.sign({id: userID}, process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn:'12d'});
    const user = await UserModel.updateOne({_id: userID}, {
        refresh_token: token,
    });
    return token;
}