

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/private' {
	export const DB_HOST: string;
	export const DB_USER: string;
	export const DB_PASSWORD: string;
	export const DB_DATABASE: string;
}

export {};
