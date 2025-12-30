import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const GET: RequestHandler = async ({ cookies }) => {
    const token = cookies.get('auth');

    if (!token) {
        return new Response(JSON.stringify({ user: null }), { status: 200 });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        return new Response(JSON.stringify({ userId: payload.userId }), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ user: null }), { status: 200 });
    }
};
