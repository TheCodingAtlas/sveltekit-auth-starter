/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="lucia" />

import type { AuthRequest } from 'lucia';
import type { UserPreferences, UserStatus } from '$lib/models/User';

declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
			name: string;
			status?: UserStatus;
			preferences?: UserPreferences;
		};
		type DatabaseSessionAttributes = {};
	}

	namespace App {
		interface Locals {
			auth: AuthRequest;
		}

		interface PageData {}

		interface Platform {}
	}

	interface Window {}
}

// THIS IS IMPORTANT!!!
export {};
