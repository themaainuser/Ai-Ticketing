import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma/index.js";
import { inngest } from "../inngest/client.js";
import { prisma } from "../index.js";

export const signup = async (req: any, res: any) =>{
    const {email, password, skills = []} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                skills  
            }
        })
        await inngest.send({
            name: "user/signup",
            data: {
                email: User.email
            }
        })
        const token = jwt.sign({
            id: User.id,
            role: User.role,
            email: User.email   
        },process.env.JWT_SECRET!);

        res.json({
            token,
            User
        })
    }

    catch(error: any){
        res.status(500).json({
            error: "Error in signup",
            details: error.message
        })  
    }
}

export const login = async (req: any, res: any) =>{
    const {email, password} = req.body;
    try{
        const User = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!User){
        return res.status(401).json({ error: "User not found"})   }

        const isMatch = bcrypt.compare(password, User.password);
        
        if (!isMatch){
        return res.status(401).json({ error: "Invalid password"})   }

        const token = jwt.sign({
            id: User.id, role: User.role, email: User.email   },process.env.JWT_SECRET!);

        res.json({
            token,
            User
        })
    }
    catch(error: any){
        res.status(500).json({ error: "Error in login", details: error.message })  
    }

}

export const logout = async (req: any, res: any) =>{
    try{
        const token = res.header.authorization.split(" ")[1];
        if (!token){    
            return res.status(401).json({ error: "No token provided"})
        }
        jwt.verify(token, process.env.JWT_SECRET!, (error: any, decoded: any) => {
            if (error){
                return res.status(401).json({ error: "Invalid token"})
            }
            res.json({Message:"Logout Successfully"})
        })
        // Easy Way to Logout!
        // res.clearCookie("token");
        // res.json({ message: "Logout successful" })
    }
    catch(error: any){
        res.status(500).json({ error: "Error in login", details: error.message })  
    }

}

export const updateUser = async (req: any, res: any) => {
    const { skills = [], role, email} = req.body
    try{
        if (req.user?.role !== "admin")
            return res.status(403).json({ error: "Forbidden"})
       const user =  await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user){
            return res.status(401).json({error : "User Does not Exist"})
        }
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                skills: skills.length ?  skills : user.skills , role
            }
        })
        return res.json({ message:"User Updated Successfully" })
    }
    catch(error: any){
        res.status(500).json({ error: " Update Fail ", details: error.message })  
    }
}

export const getUsers = async (req: any, res: any) => {

    try{
        if (req.user?.role !== "admin")
            return res.status(403).json({ error: "Forbidden"})
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return res.json({ users })
    }
    catch(error: any){
        res.status(500).json({ error: "Failed to Retrive", details: error.message })  
    }
}