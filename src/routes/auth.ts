import { FastifyInstance } from "fastify";
import axios from 'axios';
import { z as validate } from 'zod';
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (req) => {
        const bodySchema = validate.object({
            code: validate.string()
        });

        const { code } = bodySchema.parse(req.body);

        const accessTokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            null,
            {
                params: {
                    code, client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET,
                },
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const { access_token } = accessTokenResponse.data;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
        );

        const userSchema = validate.object({
            id: validate.number(),
            login: validate.string(),
            name: validate.string(),
            avatar_url: validate.string().url(),
        })

        const userInfo = userSchema.parse(userResponse.data);

        let user = await prisma.user.findUnique({
            where: {
                githubId: userInfo.id
            }
        })

        if (Boolean(user) === false) {
            user = await prisma.user.create({
                data: {
                    githubId: userInfo.id,
                    login: userInfo.login,
                    name: userInfo.name,
                    avatarUrl: userInfo.avatar_url
                }
            })
        }

        const token = app.jwt.sign({
            name: user?.name,
            avatarUrl: user?.avatarUrl
        },
            {
                sub: user?.id,
                expiresIn: '30 days'
            })

        console.log(token)

        return token;
    })
}