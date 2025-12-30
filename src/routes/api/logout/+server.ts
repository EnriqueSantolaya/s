import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete('auth', { path: '/' });
    return new Response(null, { status: 204 });
};
