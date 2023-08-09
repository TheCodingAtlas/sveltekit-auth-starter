import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';
import * as EmailValidator from 'email-validator';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	// Session exists, redirect.
	if (session) throw redirect(302, '/');

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		/**
		 * Don't worry about the casts.
		 * if a field is missing, it will throw an error later during validation.
		 */
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!EmailValidator.validate(email)) {
			return fail(400, {
				message: 'Invalid email',
			});
		}

		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password',
			});
		}

		try {
			// Find user by key and validate password.
			const user = await auth.useKey('email', email.toLowerCase(), password);

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {},
			});

			// Set session cookie.
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// User does not exist or invalid password.
				return fail(400, {
					message: 'Incorrect username or password',
				});
			}
			return fail(500, {
				message: 'An unknown error occurred',
			});
		}
		// Redirect to page of choice.
		// Make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	},
};
