import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	return {
		session,
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) throw redirect(302, '/');

		await auth.invalidateSession(session.sessionId);
		await auth.deleteDeadUserSessions(session.userId);

		throw redirect(302, '/login');
	},
};
