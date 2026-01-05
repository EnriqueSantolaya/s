import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';

// GET /api/users
export const GET: RequestHandler = async () => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, createdAt: true }
    });
    return new Response(JSON.stringify(users), { status: 200 });
};

// POST /api/users
export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        console.log('Body recibido:', data);

        const { username, password } = data;

        if (!username || !password) {
            return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Password hash creado:', passwordHash);

        const user = await prisma.user.create({
            data: { username, passwordHash },
            select: { id: true, username: true, createdAt: true }
        });

        console.log('Usuario creado:', user);

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (err: any) {
        console.error('Error en POST /api/users:', err);
        if (err.code === 'P2002') {
            return new Response(JSON.stringify({ error: 'Usuario ya existe' }), { status: 409 });
        }
        return new Response(JSON.stringify({ error: 'Error creando usuario' }), { status: 500 });
    }
};
