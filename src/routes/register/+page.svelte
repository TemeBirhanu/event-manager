<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from './$types';
    import type { SuperForm, SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';
    import { registerSchema } from '$lib/schemas';
    import { goto } from '$app/navigation';

    type RegisterFormData = z.infer<typeof registerSchema>;
    type FormResult = RegisterFormData & { success?: boolean; message?: string };
    export let data: PageData & { form: SuperValidated<FormResult> };
    let message = '';
    const { form, errors, enhance, submitting } = superForm(data.form, {
        resetForm: true,
        onResult: ({ result }) => {
            console.log('Full result:', result);
            if (result.type === 'success' && result.data?.success) {
                message = result.data.message;
                setTimeout(() => {
                    goto('/login');
                }, 6000);
            }
        }
    });
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">

    <nav class="h-16 w-full bg-white shadow-md">
        <div class="container mx-auto px-6 h-full flex items-center justify-between">
            <a href="/" class="font-serif text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Event Manager
            </a>
        </div>
    </nav>


    <div class="flex-1 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
                
                {#if message}
                    <div class="mb-4 p-4 rounded-lg {message.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}">
                        {message}
                    </div>
                {/if}

                <form method="POST" use:enhance class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            bind:value={$form.name}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your name"
                            required
                        />
                        {#if $errors.name}
                            <p class="mt-1 text-sm text-red-500">{$errors.name.join(', ')}</p>
                        {/if}
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            bind:value={$form.email}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                        {#if $errors.email}
                            <p class="mt-1 text-sm text-red-500">{$errors.email.join(', ')}</p>
                        {/if}
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            bind:value={$form.password}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                        {#if $errors.password}
                            <p class="mt-1 text-sm text-red-500">{$errors.password.join(', ')}</p>
                        {/if}
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            bind:value={$form.confirmPassword}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                        {#if $errors.confirmPassword}
                            <p class="mt-1 text-sm text-red-500">{$errors.confirmPassword.join(', ')}</p>
                        {/if}
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                        disabled={$submitting}
                    >
                        {#if $submitting}
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating Account...</span>
                        {:else}
                            <span>Create Account</span>
                        {/if}
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-gray-600">
                        Already have an account?
                        <a 
                            href="/login" 
                            class="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                            Sign in
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>