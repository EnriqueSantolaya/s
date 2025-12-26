import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';

export const GET: RequestHandler = async ({ params }) => {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: { id: true, username: true, createdAt: true }
    });
    if (!user) return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
    return new Response(JSON.stringify(user), { status: 200 });
};

export const PUT: RequestHandler = async ({ params, request }) => {
    const { username, password } = await request.json();

    const data: any = {};
    if (username) data.username = username;
    if (password) data.passwordHash = await bcrypt.hash(password, 10);

    try {
        const updated = await prisma.user.update({
            where: { id: params.id },
            data, 
            select: { id: true, username: true, createdAt: true }
        });
        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (err: any) {
        if (err.code === 'P2002') return new Response(JSON.stringify({ error: 'Usuario ya existe' }), { status: 409 });
        return new Response(JSON.stringify({ error: 'Error actualizando usuario' }), { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    await prisma.user.delete({ where: { id: params.id } });
    return new Response(null, { status: 204 });
};
