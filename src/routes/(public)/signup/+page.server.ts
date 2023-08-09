import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import * as EmailValidator from 'email-validator';
import type { PageServerLoad, Actions } from './$types';
import { generateUserId } from '$lib/utils/id';
import { dbConnection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	/**
	 * If user is already logged in, redirect to home page.
	 */
	const session = await locals.auth.validate();
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
		const emailRaw = formData.get('email') as string;
		const pw = formData.get('password') as string;
		const pwRepeat = formData.get('password_repeat') as string;

		if (!EmailValidator.validate(emailRaw)) {
			return fail(400, {
				message: 'Invalid email',
			});
		}

		const pwCheck = checkPassword(pw, pwRepeat);

		if (!pwCheck.res) {
			return fail(400, {
				message: pwCheck.errorMsg,
			});
		}

		try {
			// Sanitize.
			const email = emailRaw.toLowerCase();

			/**
			 * If you use an ORM/Query builder you can use that instead,
			 * of writing raw SQL and get better type completion.
			 */
			const executedQuery = await dbConnection.execute(
				// prettier-ignore
				'SELECT (id) FROM users WHERE email = (?)',
				[email],
			);

			// User with the same email found.
			if (executedQuery.rows.length === 1) {
				return fail(400, {
					message: 'E-mail taken.',
				});
			}

			const user = await auth.createUser({
				userId: generateUserId().toString(),
				key: {
					// Auth method.
					providerId: 'email',

					// Unique id when using "email" auth method.
					providerUserId: email,

					// Hashed by Lucia.
					password: pw,
				},
				attributes: {
					email,

					// I don't use unique usernames in
					// my system so this will work.
					username: email.split('@')[0],
					name: email.split('@')[0],
				},
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {},
			});

			// set session cookie
			locals.auth.setSession(session);

			/**
			 * This is the part where you send a verification email.
			 * This can be done immediately or in a scheduler depending
			 * on your needs.
			 */
		} catch (e) {
			// If you are using sqlite this could be handy.
			// check for unique constraint error in user table
			// if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			// 	return fail(400, {
			// 		message: 'Username already taken',
			// 	});
			// }

			return fail(500, {
				message: 'An unknown error occurred',
			});
		}

		// Redirect to page of choice.
		// Do not this throw inside a try/catch block!
		throw redirect(302, '/');
	},
};

// Probably best to use Zod or something similar.
// But this will do for a start.
function checkPassword(pw: string, pwRepeat: string): PwCheckResult {
	if (typeof pw !== 'string') {
		return {
			res: false,
			errorMsg: 'Password is not a string.',
		};
	}

	// If pw contains spaces, it's probably a mistake.
	if (pw.includes(' ')) {
		return {
			res: false,
			errorMsg: 'Password contains spaces.',
		};
	}

	if (pw.length < 6) {
		return {
			res: false,
			errorMsg: 'Password is too short.',
		};
	}

	if (pw.length > 255) {
		return {
			res: false,
			errorMsg: 'Password is too long.',
		};
	}

	if (pw !== pwRepeat) {
		return {
			res: false,
			errorMsg: 'Passwords do not match.',
		};
	}

	return {
		res: true,
		errorMsg: '',
	};
}

type PwCheckResult = {
	// True = success.
	// False = fail.
	res: boolean;
	errorMsg: string;
};
