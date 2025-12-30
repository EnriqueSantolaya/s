import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) {
        return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
    }

    const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    cookies.set('auth', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({
        id: user.id,
        username: user.username
    }), { status: 200 });
};
