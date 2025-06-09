<script lang="ts">
    import type { PageData } from './$types';
    import AuthForm from '$lib/components/AuthForm.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import type { SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';
    import { loginSchema } from '$lib/schemas';

    type LoginFormData = z.infer<typeof loginSchema>;
    export let data: PageData & { form: SuperValidated<LoginFormData> };
    const { form, errors } = superForm(data.form);

    const alternateLink = {
        text: "Don't have an account?",
        href: '/register'
    };
</script>

<AuthForm 
    {data} 
    title="Welcome Back" 
    submitLabel="Sign in"
    {alternateLink}
>
    <FormInput
        id="email"
        name="email"
        type="email"
        label="Email Address"
        bind:value={$form.email}
        errors={$errors.email}
        required
        placeholder="Enter your email"
    />

    <FormInput
        id="password"
        name="password"
        type="password"
        label="Password"
        bind:value={$form.password}
        errors={$errors.password}
        required
        placeholder="••••••••"
    />

    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
            </label>
        </div>
        <a href="/" class="text-sm text-blue-500 hover:text-blue-600">
            Forgot password?
        </a>
    </div>
</AuthForm>