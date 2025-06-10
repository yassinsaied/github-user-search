import { GitHubUser, ApiResponse } from '../types';

const GITHUB_API = 'https://api.github.com/search/users';

interface GitHubApiResponse {
	items: GitHubUser[];
	total_count: number;
}

export const searchUsers = async (
	query: string,
	page: number = 1,
	perPage: number = 30
): Promise<ApiResponse> => {
	if (!query.trim()) return { users: [], error: null, hasMore: false };

	try {
		const response = await fetch(
			`${GITHUB_API}?q=${encodeURIComponent(
				query
			)}&page=${page}&per_page=${perPage}`
		);

		if (!response.ok) {
			if (response.status === 403) {
				throw new Error(
					"Limite de débit de l'API GitHub atteinte. Veuillez patienter."
				);
			}
			if (response.status === 422) {
				throw new Error(
					'Recherche invalide. Veuillez modifier votre requête.'
				);
			}
			throw new Error(`Erreur ${response.status}: ${response.statusText}`);
		}

		const data: GitHubApiResponse = await response.json();

		if (!data.items || data.items.length === 0) {
			return {
				users: [],
				error:
					page === 1
						? 'Aucun utilisateur trouvé pour cette recherche.'
						: null,
				hasMore: false,
			};
		}

		const hasMore =
			data.items.length === perPage && data.total_count > page * perPage;

		return { users: data.items, error: null, hasMore };
	} catch (error) {
		console.error('Erreur API:', error);
		return {
			users: [],
			error:
				error instanceof Error
					? error.message
					: "Une erreur inconnue s'est produite",
			hasMore: false,
		};
	}
};
