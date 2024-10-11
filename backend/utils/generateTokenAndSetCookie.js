// import JWT from 'jsonwebtoken'

// const generateTokenAndSetCookie = (res, userId) => {
//     const token = JWT.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
// 		expiresIn: "7d",
// 	});

//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 30 // 30 days
//     });

//     return token;
// }

// export {generateTokenAndSetCookie}


import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};