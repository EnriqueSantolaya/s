import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ cookies }) => {
    const token = cookies.get('auth');

    if (!token) {
        return new Response(JSON.stringify({ user: null }));
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                username: true
            }
        });

        return new Response(JSON.stringify({ user }));
    } catch {
        return new Response(JSON.stringify({ user: null }));
    }
};
