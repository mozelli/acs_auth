import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/authConfig";


export function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        return response.status(401).json({ message: "Invalid token.", sub: 1 });
    }

    const parts = authHeader.split(' ');

    if(parts.length < 2) {
        return response.status(401).json({ message: "Invalid token.", sub: 2 });
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) {
        return response.status(401).json({ message: "Invalid token.", sub: 3 });
    }

    jwt.verify(token, config.secret, (error, decoded) => {
        if(error) {
            if(error.name === "TokenExpiredError") {
                return response.status(401).json({ message: "Invalid token.", sub: 4 });
            }
            return response.status(401).json({ message: "Invalid token.", sub: 5 });
        }

        request.user_id = decoded.id;
        return next();
    });
}