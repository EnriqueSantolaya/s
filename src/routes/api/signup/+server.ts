import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: 'Usuario y contraseña obligatorios' }),
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return new Response(
      JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }),
      { status: 400 }
    );
  }

  // comprobar si ya existe
  const existingUser = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: 'El usuario ya existe' }),
      { status: 409 }
    );
  }

  // hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // crear usuario
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash
    }
  });

  // generar JWT
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // guardar cookie
  cookies.set('auth', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });

  return new Response(
    JSON.stringify({
      id: user.id,
      username: user.username
    }),
    { status: 201 }
  );
};
