import { connect } from '@planetscale/database';
import { env } from '$env/dynamic/private';
import { uuidv7 } from '$lib/utils/id';

export const dbConnection = connect({
	host: env.PLANETSCALE_HOST!,
	username: env.PLANETSCALE_USERNAME!,
	password: env.PLANETSCALE_PASSWORD!,
});

export async function getNewUsernameIfInvalid(username: string) {
	/**
	 * Set whatever rules you need here.
	 */
	if (username.length < 1) {
		return uuidv7().slice(0, 8);
	}

	return username;

	/**
	 * If you need to support unqiue username in your system.
	 * Probably use an ORM/Query builder if you can.
	 *
	 * In my system usernames are not unique, so I don't
	 * have to worry about it.
	 */
	// Planetscale example.
	// const res = await dbConnection.execute('SELECT * FROM users WHERE username=?', [username]);

	// if (res.rows.length > 0) {
	// 	return `${username}-${uuidv7().slice(0, 4)}`;
	// }

	// return username;
}
