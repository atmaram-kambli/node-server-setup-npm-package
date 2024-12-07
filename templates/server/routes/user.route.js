import { Router } from 'express';
import { forgotPasswordController, loginController, logoutController, refreshToken, regiterUserController, 
        resetpasswordController, updateUserDetails, uploadUserAvatar, userDetails, verifyEmailController, 
        verifyForgotPasswordOTP } from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.post('/register', regiterUserController);
router.post('/verify-email', verifyEmailController);
router.post('/login', loginController);
router.get('/logout', auth, logoutController);
router.put('/update-user', auth, updateUserDetails);
router.put('/upload-avatar', auth, upload.single('avatar'), uploadUserAvatar);
router.put('/forgot-password',forgotPasswordController);
router.put('/verify-forgot-password-otp',verifyForgotPasswordOTP);
router.put('/reset-password',resetpasswordController);
router.post('/refresh-token',refreshToken);
router.get('/user-details',auth,userDetails);

export default router;