import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z as validate } from 'zod';

export async function memoriesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (req) => {
        await req.jwtVerify();
    })

    app.get('/memories', async (req) => {
        const memories = await prisma.memory.findMany({
            where: { userId: req.user.sub },
            orderBy: {
                createAt: 'asc'
            }
        })

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat("..."),
                createAt: memory.createAt
            }
        });
    })

    app.get('/memories/:id', async (req, reply) => {
        const paramsSchema = validate.object({
            id: validate.string().uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id
            }
        });

        if (memory.isPublic || memory.userId !== req.user.sub) {
            return reply.status(401).send();
        }

        return memory;
    })

    app.post('/memories', async (req, res) => {
        const bodySchema = validate.object({
            content: validate.string(),
            coverUrl: validate.string(),
            isPublic: validate.coerce.boolean().default(false)
        })

        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: req.user.sub
            }
        })

        return memory;
    })

    app.put('/memories/:id', async (req, reply) => {
        const paramsSchema = validate.object({
            id: validate.string().uuid()
        })

        const bodySchema = validate.object({
            content: validate.string(),
            coverUrl: validate.string(),
            isPublic: validate.coerce.boolean().default(false)
        })

        const { id } = paramsSchema.parse(req.params)
        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

        let memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (memory.userId !== req.user.sub) {
            return reply.status(401).send();
        }

        memory = await prisma.memory.update({
            where: {
                id
            },
            data: {
                content,
                coverUrl,
                isPublic,
            }
        });

        return memory;
    })

    app.delete('/memories/:id', async (req, reply) => {
        const paramsSchema = validate.object({
            id: validate.string().uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (memory.userId !== req.user.sub) {
            return reply.status(401).send();
        }

        await prisma.memory.delete({
            where: {
                id
            }
        });
    })
}
