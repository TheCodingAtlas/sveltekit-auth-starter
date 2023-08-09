import { doesRouteRequireAuthorisation } from '$lib/helpers';
import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	/**
	 * This a simple system, that works quite well for small
	 * scale projects. For larger projects, you may want to
	 * consider using a more robust system.
	 */
	if (doesRouteRequireAuthorisation(event.route.id ?? '')) {
		const session = await event.locals.auth.validate();

		if (!session) {
			throw redirect(302, '/login');
		}
	}

	return await resolve(event);
};
