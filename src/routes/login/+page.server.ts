import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
    const form = await superValidate(zod(loginSchema));
    return { form };
};

export const actions = {
    default: async ({ request, cookies }: RequestEvent) => {
        const form = await superValidate(request, zod(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const { email, password } = form.data as z.infer<typeof loginSchema>;

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return fail(401, { 
                    form,
                    message: 'Invalid email or password'
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return fail(401, { 
                    form,
                    message: 'Invalid email or password'
                });
            }

            // Set session cookie
            const session = await prisma.session.create({
                data: {
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                }
            });

            cookies.set('sessionId', session.id, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });

            return { form, success: true };
        } catch (error) {
            console.error('Login error:', error);
            return fail(500, { 
                form,
                message: 'An error occurred during login'
            });
        }
    }
};
