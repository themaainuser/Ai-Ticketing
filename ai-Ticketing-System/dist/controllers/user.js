var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inngest } from "../inngest/client.js";
import { prisma } from "../index.js";
export const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, skills = [] } = req.body;
    try {
        const hashedPassword = yield bcrypt.hash(password, 10);
        const User = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                skills
            }
        });
        yield inngest.send({
            name: "user/signup",
            data: {
                email: User.email
            }
        });
        const token = jwt.sign({
            id: User.id,
            role: User.role,
            email: User.email
        }, process.env.JWT_SECRET);
        res.json({
            token,
            User
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Error in signup",
            details: error.message
        });
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const User = yield prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!User) {
            return res.status(401).json({ error: "User not found" });
        }
        const isMatch = bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({
            id: User.id, role: User.role, email: User.email
        }, process.env.JWT_SECRET);
        res.json({
            token,
            User
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error in login", details: error.message });
    }
});
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.header.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: "Invalid token" });
            }
            res.json({ Message: "Logout Successfully" });
        });
        // Easy Way to Logout!
        // res.clearCookie("token");
        // res.json({ message: "Logout successful" })
    }
    catch (error) {
        res.status(500).json({ error: "Error in login", details: error.message });
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { skills = [], role, email } = req.body;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
            return res.status(403).json({ error: "Forbidden" });
        const user = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(401).json({ error: "User Does not Exist" });
        }
        yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                skills: skills.length ? skills : user.skills, role
            }
        });
        return res.json({ message: "User Updated Successfully" });
    }
    catch (error) {
        res.status(500).json({ error: " Update Fail ", details: error.message });
    }
});
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
            return res.status(403).json({ error: "Forbidden" });
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to Retrive", details: error.message });
    }
});
