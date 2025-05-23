import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
    try {
        const { email, password } = await request.json();

        
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return json({ error: 'Invalid credentials' }, { status: 401 });
        }

      
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return json({ error: 'Invalid credentials' }, { status: 401 });
        }

       
        const { password: _, ...userWithoutPassword } = user;

        return json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        return json({ error: 'Error during login' }, { status: 500 });
    }
}
