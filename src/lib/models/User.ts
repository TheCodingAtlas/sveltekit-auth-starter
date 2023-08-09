/**
 * I prefer to use an enum because it's easier to read and understand.
 * It maps to a TINYINT column so highly efficient in the database, compared
 * to strings.
 *
 * Signed TINYINT: -128 to 127 so we have 256 possible values.
 */
export enum UserStatus {
	Unverified = 0,
	Verified = 1,

	/**
	 * You can soft-delete a user by setting their status to -1.
	 *
	 * GDPR/Privacy Laws:
	 * If a user under Privacy Laws(GPDR/...) requests to be deleted,
	 * then you must fully delete their account and all of their data.
	 * In that case depending on your system you might have to link to a
	 * a default anonymous user in order to maintain a proper functioning system.
	 * For example: reddit with all their [deleted] users.
	 */
	Deleted = -1,
}

export function getDefaultPreferences(): UserPreferences {
	return {};
}

export type UserPreferences = {};
