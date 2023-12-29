import jwt from 'jsonwebtoken';
import { config } from "../config/authConfig";

export function accessToken(user_id: string): string {
    
    const token = jwt.sign({ id: user_id }, config.secret, {
        expiresIn: 3600
    });
    return token;
}

export function refreshToken(user_id: string): string {
    const refreshToken = jwt.sign({ id: user_id }, config.secret, {
        expiresIn: 2592000
    });
    return refreshToken;
}