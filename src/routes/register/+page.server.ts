import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';
import { findUserByEmail, createUser } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
    const form = await superValidate(zod(registerSchema));
    return { form };
};

export const actions = {
    default: async ({ request }: RequestEvent) => {
        const form = await superValidate(request, zod(registerSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const { email, password, name } = form.data as z.infer<typeof registerSchema>;

            const existingUser = await findUserByEmail(email);

            if (existingUser) {
                return fail(400, {
                    form,
                    success:false,
                    message: 'User already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await createUser(email, hashedPassword, name);

            return {
                form,
                success: true,
                message: 'Registration successful! Please log in.'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, {
                form,
                message: 'An error occurred during registration'
            });
        }
    }
};
