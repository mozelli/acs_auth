import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import bcrypt from 'bcrypt';
import { accessToken } from "../functions/tokenGenerate";

export class AuthController {
    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        try {
            const auth = await prismaClient.user.findUnique({
                where: {
                    email
                }
            });
            
            if(auth) {
                const hash = auth.password_hash;
                const password_authenticated = bcrypt.compareSync(password, hash)

                if(password_authenticated) {
                    return response.status(200).json(
                        {
                            message: "Authenticated!", 
                            user: {
                                user_id: auth.user_id,
                                name: auth.name,
                                email: auth.email,
                                birthday: auth.birthday,
                                gender: auth.gender
                            },
                            token: accessToken(auth.user_id)
                        });
                } else {
                    return response.status(400).json({message: "Invalid informations."})
                }

            } else {
                return response.status(400).json({message: "User not found."}).header;
            }
        } catch(error) {
            return response.status(500).json({message: "Error in AuthController / authenticate", error});
        }
    }
}