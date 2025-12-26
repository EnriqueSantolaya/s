import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

// GET /api/projects/:id
export const GET: RequestHandler = async ({ params }) => {
    const project = await prisma.project.findUnique({
        where: { id: params.id }
    });

    if (!project) return new Response(JSON.stringify({ error: 'Proyecto no encontrado' }), { status: 404 });
    return new Response(JSON.stringify(project), { status: 200 });
};

// PUT /api/projects/:id 
export const PUT: RequestHandler = async ({ params, request }) => {
    const data = await request.json();

    const updated = await prisma.project.update({
        where: { id: params.id },
        data
    });

    return new Response(JSON.stringify(updated), { status: 200 });
};

// DELETE /api/projects/:id
export const DELETE: RequestHandler = async ({ params }) => {
    await prisma.project.delete({ where: { id: params.id } });
    return new Response(null, { status: 204 });
};
