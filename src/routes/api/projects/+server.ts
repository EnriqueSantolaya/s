import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const GET: RequestHandler = async ({ cookies }) => {
    const token = cookies.get('auth');

    if (!token) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    let userId: string;
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = payload.userId;
    } catch {
        return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
    }

    const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify(projects), { status: 200 });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    const token = cookies.get('auth');

    if (!token) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    let userId: string;
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = payload.userId;
    } catch {
        return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
    }

    const {
        latitud,
        meses,
        alturaFija,
        acimutFijo,
        altura,
        acimut,
        energia
    } = await request.json();

    if (latitud === undefined || !Array.isArray(meses)) {
        return new Response(
            JSON.stringify({ error: 'Faltan datos obligatorios' }),
            { status: 400 }
        );
    }

    const project = await prisma.project.create({
        data: {
            userId,
            latitud,
            meses,
            alturaFija: alturaFija ?? null,
            acimutFijo: acimutFijo ?? null,
            altura: altura ?? null,
            acimut: acimut ?? null,
            energia: energia ?? null
        }
    });

    return new Response(JSON.stringify(project), { status: 201 });
};
