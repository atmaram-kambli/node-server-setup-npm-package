import UserModel from '../models/user.model.js';
import sendEmail from '../config/sendEmail.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generateAccessToken.js';
import genertedRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import generateOTP from '../utils/generateOTP.js';

// 1. New User Registeration
export async function regiterUserController(req, res) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Provide valid credentials!",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({email});
        if(user) {
            return res.status(400).json({
                message: "Already registered User! Try Login",
                error: true,
                success: false,
            });
        }

        const salt = await bcryptjs.genSalt(12);
        const hashPass = await bcryptjs.hash(password, salt);

        const payload = {
            name, 
            email,
            password: hashPass,
        }

        const newUser = await UserModel(payload);
        const save = await newUser.save();

        const verity_page_url = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
        // console.log(verity_page_url);

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify Email from '<your_project_name>'",
            html: verifyEmailTemplate({name, verity_page_url})
        })

        return res.status(200).json({
            message: "User is registered successfully!",
            error: false,
            success: true,
            data: save,
        });

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// 2. USer Email Verification
export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body;
        const findUser = await UserModel.findById(code);

        if(!findUser) {
            return res.status(400).json({
                message: "Bad request!",
                error: true,
                success: false,
            });
        }
        const updatedUser = await UserModel.updateOne({_id: code}, {
            verify_email: true,
        })
        // console.log(updatedUser);
        return res.status(200).json({
            message: "User is verified successfully!",
            error: false,
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// 3. User Login Controller
export async function loginController(req,res){
    try {
        const { email , password } = req.body

        if(!email || !password){
            return res.status(400).json({
                message : "Invalid crendentials!",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "User is not registered. Try SignUp!",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return res.status(400).json({
                message : "Access Denied!",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return res.status(400).json({
                message : "Wrong crendentials!",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        res.cookie('accessToken',accesstoken,cookiesOption)
        res.cookie('refreshToken',refreshToken,cookiesOption)

        return res.json({
            message : "User is Logged in Successfully!",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// 4. User logout controller
export async function logoutController(req,res){
    try {
        const userid = req.userId

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return res.json({
            message : "User is Logged out successfully!",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


// 5. Upload/update User Avatar controller
export async function uploadUserAvatar(req, res) {
    try {
        const image = req.file;

        const upload = await uploadImageCloudinary(image);

        const userId = req.userId;
        const updateUser = await UserModel.findByIdAndUpdate( userId, {
            avatar: upload.url,
        })

        // console.log('Image', image);
        return res.status(200).json({
            message : "Image is uploaded successfully!",
            error : false,
            success : true,
            data : {
                _id : userId,
                avatar: upload.url
            },
        })
    } catch (error) {
        return res.status(500).json({
            message : "error.message || error",
            error : true,
            success : false
        })
    }
}

// 6. Update User Details
export async function updateUserDetails(req,res){
    try {
        const userId = req.userId;
        const { name, email, mobile, password } = req.body;

        let hashPassword = "";

        if(password){
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password,salt);
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return res.json({
            message : "User details are updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


// 7. Forgot password controller 
export async function forgotPasswordController(req,res) {
    try {
        const { email } = req.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Provide valid credentials!",
                error : true,
                success : false
            })
        }

        const otp = generateOTP()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from <your_project_name>>",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.json({
            message : "Check your email for OTP!",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// 8. Verify OTP controller 
export async function verifyForgotPasswordOTP(req,res){
    try {
        const { email , otp }  = req.body

        if(!email || !otp){
            return res.status(400).json({
                message : "Error! Provide valid credentials",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "User with given Email is not registered Try SignUp.",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message : "OTP is expired!",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message : "Invalid OTP!",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return res.json({
            message : "OTP is verified successfully!",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// 9. Reset password controller
export async function resetpasswordController(req,res){
    try {
        const { email , newPassword, confirmPassword } = req.body 

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "Provide valid credentials!",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Wrong Email address.",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "New Password and Confirm Password must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return res.json({
            message : "Password is updated successfully!",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// 10. Update the refresh token
export async function refreshToken(req,res){
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return res.status(401).json({
                message : "Token is expired",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(401).json({
                message : "Token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken',newAccessToken,cookiesOption)

        return res.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// 11. Get User Details
export async function userDetails(req,res){
    try {
        const userId  = req.userId;

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        return res.json({
            message : 'User details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!",
            error : true,
            success : false
        })
    }
}