import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import bcrypt from 'bcrypt';
import { accessToken } from "../functions/tokenGenerate";

export class UserController {
    async createUser(request: Request, response: Response) {
        console.log("New access!");
        
        const { name, email, birthday, gender, password } = request.body;

        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email
                }
            });
            
            if(user) {
                return response.status(400).json({message: "User already exists!"});
            } else {
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const password_hash = bcrypt.hashSync(password, salt);
                
                const result = await prismaClient.user.create({
                    data: {
                        name,
                        email,
                        birthday,
                        gender,
                        password_hash
                    }
                })
        
                return response.status(201).json({
                    user: {
                        name: result.name,
                        email: result.email,
                        birthday: result.birthday,
                        gender: result.gender
                    },
                    token: accessToken(result.user_id)
                });

            }
        } catch (error) {
            return response.status(500).json({error});
        }
    }

    async readUsers(request: Request, response: Response) {
        try {
            const users = await prismaClient.user.findMany({
                select: {
                    name: true,
                    email: true,
                    birthday: true,
                    gender: true
                }
            });
            return response.status(200).json({ users, id: request.user_id });
        } catch(error) {
            return response.status(500).json({message: "Error in UserController / readUsers"});
        }
    }

    async readUserById(request: Request, response: Response) {
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