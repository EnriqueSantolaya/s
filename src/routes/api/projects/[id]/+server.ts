import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const DELETE: RequestHandler = async ({ params, cookies }) => {
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

    const projectId = params.id;

    // Verificamos que el proyecto pertenece al usuario
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        return new Response(
            JSON.stringify({ error: 'Proyecto no encontrado' }),
            { status: 404 }
        );
    }

    await prisma.project.delete({
        where: { id: projectId }
    });

    return new Response(null, { status: 204 });
};
