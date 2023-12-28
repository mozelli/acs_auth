import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import bcrypt from 'bcrypt';

export class UserController {
    async createUser(request: Request, response: Response) {
        console.log("New access!");
        
        const { name, email, birthday, gender, password } = request.body;

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const password_hash = bcrypt.hashSync(password, salt);

        try {
            const user = await prismaClient.user.create({
                data: {
                    name,
                    email,
                    birthday,
                    gender,
                    password_hash
                }
            })
    
            return response.status(201).json(user);
        } catch(error) {
            return response.status(500).json(error);
        }
    }

    async readUser(request: Request, response: Response) {
        const { user_id } = request.params;

        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    user_id
                }
            });

            if(user) {
                return response.status(200).json(user);
            } else {
                return response.status(404).json({message: "User not found."});
            }
        } catch(error) {
            return response.status(500).json({message: "Error in UserController / readUser"});
        }
    }

    async deleteUser(request: Request, response: Response) {
        const { user_id } = request.body;

        try {
            const access_token = await prismaClient.accessTokens.deleteMany({
                where: {
                    user_id
                }
            });

            const user_permissions = await prismaClient.userPermissions.deleteMany({
                where: {
                    user_id
                }
            });

            const user = await prismaClient.user.delete({
                where: {
                    user_id
                }
            });
            return response.status(201).json(user);
        } catch(error) {
            console.error(error);
            return response.status(500).json(error);
        }
    }
}