import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
    try {
        const { email, password, name } = await request.json();

        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return json({ error: 'User already exists' }, { status: 400 });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        
        const { password: _, ...userWithoutPassword } = user;

        return json({ user: userWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return json({ error: 'Error creating user' }, { status: 500 });
    }
}
