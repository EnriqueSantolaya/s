import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth');

    if (token) {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, username: true }
            });
            event.locals.user = user;
        } catch {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};
