// Types pour l'utilisateur GitHub
export interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	html_url: string;
	type: string;
	isDuplicate?: boolean;
}

// Type pour la réponse de l'API
export interface ApiResponse {
	users: GitHubUser[];
	error: string | null;
	hasMore: boolean;
}

// Types pour les props des composants
export interface SearchBarProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClear: () => void;
}

export interface UserCardProps {
	user: GitHubUser;
	isEditMode: boolean;
	isSelected: boolean;
	onToggleSelection: (id: number) => void;
}

// Types pour les hooks
export type UseDebounceReturn = string;
export type UseInfiniteScrollReturn = [
	boolean,
	React.Dispatch<React.SetStateAction<boolean>>
];
