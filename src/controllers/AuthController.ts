import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import bcrypt from 'bcrypt';

export class AuthController {
    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        

        // const user = await prismaClient.user.create({
        //     data: {
        //         name,
        //         email,
        //         password_hash
        //     }
        // })

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
                    return response.status(200).json({message: "Authenticated!"})
                } else {
                    return response.status(404).json({message: "Cannot authenticate!"})
                }

            } else {
                return response.status(404).json({message: "user not found."})
            }
        } catch(error) {
            return response.status(500).json({message: "Error in AuthController / authenticate", error});
        }
    }
}