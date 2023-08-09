/**
 * I am using the great typeId package from jetpack-io.
 * https://github.com/jetpack-io/typeid
 *
 * I am not a fan of autoincrement ids because of their
 * inflexibility.
 *
 * Performance could be an issue on a huge scale (billions)
 * but if you reach that you have other problems to worry about
 * like how to spend those VC funds $$$ amirite :D
 *
 * In all seriousness, the flexibility of typeId is great,
 * especially in case of moving data around.
 *
 * Also, it is a lot easier to generate ids on the client and
 * with UUID-v7 that typeid generates, it has better
 * performance than normal UUIDs and good DX/readability.
 *
 * https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-04.html#name-uuid-version-7
 */
import { typeid } from 'typeid-js';
import type { TypeID } from 'typeid-js';

export function generatePrefixedId<T extends string>(prefix: T): TypeID<T> {
	const typeidLength = 26;

	// I don't allow IDs to be longer than 36 characters in my columns.
	// Change to your liking or implement it per id.
	const maxLenPrefix = 36 - typeidLength - 1;

	if (prefix.length > maxLenPrefix) {
		throw new Error(`Prefix too long. Max length is ${maxLenPrefix}.`);
	}

	return typeid(prefix);
}

/**
 * https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-04.html#name-uuid-version-7
 */
export function uuidv7(): string {
	return typeid().toString();
}

// This could be moved to the User model?
export function generateUserId(): TypeID<'user'> {
	return generatePrefixedId<'user'>('user');
}
