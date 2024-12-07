import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
        // console.log("Hi"+token);

        if(!token) {
            res.status(401).json({
                message: "Please authenticate using valid token.",
                error: true,
                success: false,
            })
        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if(!verifyToken){
            return res.status(401).json({
                message : "Unauthorized Access!",
                error : true,
                success : false
            })
        }
        // console.log(verifyToken.id);
        req.userId = verifyToken.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "Please authenticate using valid token!",
            error : true,
            success : false
        })
    }
}