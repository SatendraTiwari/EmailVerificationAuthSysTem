import bcryptjs from 'bcryptjs'
import crypto, { hash } from 'crypto';
import { User } from "../models/user.model.js"

// Email 
import {sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail} from '../mailtrap/emails.js'
//cookies token
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'


const signup = async (req, res) => {
    const {email, password, name} = req.body;
    const existingUser = await User.findOne({email});
    try {
        
        if(!email || !password || !name ){
            throw new Error("All dields are required")
        }
        
        // const userAlreadyUser = await User.findOne({email});
        // console.log("useralreadyExists: ", existingUser)

        if(existingUser){
            return res.status(400).json({success: false, massage: "user already exists"})
        }

        const hashPassword =  await bcryptjs.hash(password,10)

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 ,
        })

        await user.save().catch((error) => {
            console.log(error.message)
            res.status(400).json({ success: false, message: error.message });
          });

        // jwt token 

        generateTokenAndSetCookie(res , user._id);

        await  sendVerificationEmail(user.email, verificationToken)

        return res.status(201)
        .json({
            success: true,
            massage: "User create Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
        
    } catch (error) {
        console.log(res.status(400).json({ success: false, message: `${error.message} hello `}))
    }
} 


const verifyEmail  = async (req, res) => {
    // 1 2 3 4  5
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: {$gt: Date.now()}
        })
        
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid verification token"})
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        console.log("user::::::::::::::::2",user)

        await sendWelcomeEmail(user.email, user.name);


        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user : {
                ...user._doc,
                password: undefined,
            }
        })


    } catch (error) {
        res.status(500).json({success: false, massage: "Email is not Verified "})
    }
}

const login = async (req, res) => {
    const {email, password } = req.body 

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            massage: "Logged in successfully",
            user : {
                ...user._doc,
                password: undefined,
            },
        })



    } catch (error) {
        res.status(400).json({
            success: false,
            massage: error.massage
        })
    }
} 


const logout = async (req, res ) => {
    res.clearCookie("token");
    res.status(200).json({success: true, massage: "Logged out successfully "})
}


// const forgotPassword = async (req, res) => {

//     const { email } = req.body

//     try {
//         const user = await User.findOne({email})

//         console.log(user)

//         if(!user){
//             return res.status(400).json({success: false, nassage: "user is not found"})
//         }

//         // Generate reset token 

//         const resetToken = crypto.randomBytes(20).toString("hex");
//         const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour 

//         user.resetPasswordToken = resetToken;
//         user.resetPasswordExpireAt = resetTokenExpiresAt;

//         await user.save()

//         //end email 



//         await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

//         res.status(200).json({
//             success: true,
//             massage: "password reset link sent to your email"
//             })

//     } catch (error) {
//         res.status(400).json({success: false, massage: error.massage});
//     }
// }


const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpireAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword", error);
		res.status(400).json({ success: false, message: error.message || "user" });
	}
};


const resetPassword = async (req, res) => {
    try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}


const checkAuth = async (req, res) => {
    
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }


        res.status(200).json({
            success:  true,
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error in checkAuth : ",error);
        res.status(400).json({
            success: false,
            massage: error.massage
        })
    }
}


// const updateProfile = async (req,res) => {
//     try {
//         const token = req.params();
//         const {} = req.body();
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth
}