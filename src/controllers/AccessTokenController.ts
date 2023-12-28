import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";


export class AccessTokenController {
    async addNewAccessToken(request: Request, response: Response) {
        const { user_id, token_value, expiration_date } = request.body;

        const access_token = await prismaClient.accessTokens.create({
            data: {
                user_id,
                token_value,
                expiration_date
            }
        })

        return response.json(access_token);
    }
}