import { auth, googleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { generateUserId } from '$lib/utils/id.js';
import { dbConnection, getNewUsernameIfInvalid } from '$lib/server/db';
import { UserStatus, getDefaultPreferences } from '$lib/models/User';

export const GET = async ({ url, cookies, locals }) => {
	/**
	 * Check for a session. if it exists,
	 * redirect to a page of your liking.
	 */
	const session = await locals.auth.validate();
	if (session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	/**
	 * Validate state of the request.
	 */
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400,
		});
	}

	/**
	 * Here we go...
	 */
	try {
		// prettier-ignore
		const {
			existingUser,
			googleUser,
			createUser } = await googleAuth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) return existingUser;

			/// Probably will never happen but just to be sure.
			if (!googleUser.email) {
				return null;
			}

			// Query for the user with the same email.
			const executedQuery = await dbConnection.execute(
				// prettier-ignore
				'SELECT (id) FROM users WHERE email = (?)',
				[googleUser.email],
			);

			// User with the same email found.
			if (executedQuery.rows.length === 1) {
				const foundUser = executedQuery.rows[0] as { id: string };
				const providerId = `google:${googleUser.sub}`;

				// Insert the provider into the database pointing to the user.
				await dbConnection.execute(
					// prettier-ignore
					'INSERT INTO user_providers (id, user_id) VALUES (?, ?)',
					[providerId, foundUser.id],
				);
				return {
					userId: foundUser.id,
				};
			}

			/**
			 * Avatar image: googleUser.picture
			 *
			 * You could spawn a separate thread to download the image
			 * and upload it to your own CDN and then link it to the user.
			 *
			 * Cloudflare / AWS S3 / Google Cloud are options.
			 */

			let username = await getNewUsernameIfInvalid(googleUser.name ?? '');

			const user = await createUser({
				userId: generateUserId() as unknown as string,
				attributes: {
					email: googleUser.email,
					username,

					// According to the docs these properties will
					// always be there but checking just to be safe.
					name: googleUser.name ?? '',

					/**
					 * Save the link to the avatar here if you wish.
					 * A string column or a json column would work.
					 *
					 * If your upload process fails I would just let it slide,
					 * and expect the user to upload a new image.
					 *
					 * No need to overly try to cover all bases.
					 *
					 * kv stands for key-value. It's a JSON column.
					 */
					// avatar: avatarUrl,
					// kv: JSON.stringify({ avatar: avatarUrl }),

					/**
					 * A preferences JSON column is a good idea.
					 * Some people prefer to store it in a separate table, but I
					 * dislike the joins.
					 *
					 * Other people prefer to have an extremely light user table and
					 * split everything into separate tables. Depends a bit on your
					 * scale. I wouldn't worry about it too much at the start.
					 */
					preferences: JSON.stringify(getDefaultPreferences()),

					// We can safely do this since google verifies emails.
					status: UserStatus.Verified,
				},
			});

			/**
			 * If creating the user was successfull:
			 *
			 * setup the database with default data for the user.
			 * Could be a default workspace, or a default project.
			 *
			 * Could potentially fail. Very rare, but make sure to handle errors
			 * either here or whenever the user requests that specific data.
			 * A lot of ORMs have findOrCreate methods which help with this.
			 */
			// setupDefaultData(user);

			return user;
		};

		const user = await getUser();

		if (!user) {
			/**
			 * You should probably redirect the user to a page and show a
			 * message that the account could not be created.
			 *
			 * This is a very rare case, but it can happen.
			 */
			return new Response(null, {
				status: 500,
			});
		}

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {},
		});

		locals.auth.setSession(session);

		/**
		 * Home run!
		 */
		// Redirect the page of choice.
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	} catch (e) {
		// TODO: Log error into system.
		console.log(e);

		// Invalid code.
		if (e instanceof OAuthRequestError) {
			return new Response(null, {
				status: 400,
			});
		}

		// All other errors.
		return new Response(null, {
			status: 500,
		});
	}
};
