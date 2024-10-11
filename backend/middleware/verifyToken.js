import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if(!token) return res.status(401).json({success: true, massage: "unauthrized - no  token provide"})
     try {
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    if(!decoded) return res.status(401).json({success: false, massage:"nauthorized = invaild token"})
    req.userId = decoded.userId;
    next();


        
     } catch (error) {
        return res.status(500).json({success:  false, massage: "server Error"})
     }
}