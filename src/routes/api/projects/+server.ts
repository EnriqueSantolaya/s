import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

// GET /api/projects?userId=...
export const GET: RequestHandler = async ({ url }) => {
    const userId = url.searchParams.get('userId');
    if (!userId) return new Response(JSON.stringify({ error: 'Falta userId' }), { status: 400 });

    const projects = await prisma.project.findMany({
        where: { userId }
    });

    return new Response(JSON.stringify(projects), { status: 200 });
};

// POST /api/projects
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const { userId, latitud, meses, alturaFija, acimutFijo, altura, acimut, energia } = data;

    if (!userId || latitud === undefined || !meses) {
        return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), { status: 400 });
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
