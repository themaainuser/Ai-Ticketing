import jwt from "jsonwebtoken";

export const auth = async (req: any, res: any, next: any) => {
    const token = res.header.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json({
            error:"access Denied. no toke found."
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({error: error})
    }
}