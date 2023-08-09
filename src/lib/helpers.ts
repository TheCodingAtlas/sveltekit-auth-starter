export function doesRouteRequireAuthorisation(routeId: string): boolean {
	return routeId.startsWith('/(app)');
}
