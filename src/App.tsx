import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import UserCard from './components/UserCard/UserCard';
import { searchUsers } from './services/githubApi';
import { useDebounce } from './hooks/useDebounce';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { GitHubUser } from './types';
import './App.css';

const App: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [users, setUsers] = useState<GitHubUser[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const debouncedQuery = useDebounce(searchQuery, 500);

	const fetchMoreData = useCallback(async (): Promise<void> => {
		if (!debouncedQuery.trim() || !hasMore || loading) return;

		setLoading(true);
		try {
			const result = await searchUsers(debouncedQuery, page + 1);
			if (result.users.length > 0) {
				setUsers((prev) => [...prev, ...result.users]);
				setPage((prev) => prev + 1);
			}
			setHasMore(result.hasMore);
			setError(result.error);
		} catch (error) {
			console.error('Erreur:', error);
			setError("Une erreur inattendue s'est produite.");
		}
		setLoading(false);
	}, [debouncedQuery, page, hasMore, loading]);

	const [isFetching] = useInfiniteScroll(fetchMoreData);

	useEffect(() => {
		const fetchInitialUsers = async (): Promise<void> => {
			if (!debouncedQuery.trim()) {
				setUsers([]);
				setError(null);
				setPage(1);
				setHasMore(true);
				return;
			}

			setLoading(true);
			setError(null);
			setPage(1);

			try {
				const result = await searchUsers(debouncedQuery, 1);
				setUsers(result.users);
				setHasMore(result.hasMore);
				setError(result.error);
			} catch (error) {
				console.error('Erreur:', error);
				setUsers([]);
				setError("Une erreur inattendue s'est produite.");
			}
			setLoading(false);
		};

		fetchInitialUsers();
	}, [debouncedQuery]);

	const toggleSelection = useCallback((id: number): void => {
		setSelectedIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	}, []);

	const handleDuplicate = useCallback((): void => {
		const newUsers: GitHubUser[] = [];

		users.forEach((user) => {
			newUsers.push(user);
			if (selectedIds.has(user.id)) {
				const duplicatedUser: GitHubUser = {
					...user,
					id: Date.now() + Math.random(),
					login: `${user.login}_copy`,
					isDuplicate: true,
				};
				newUsers.push(duplicatedUser);
			}
		});

		setUsers(newUsers);
		setSelectedIds(new Set());
	}, [users, selectedIds]);

	const handleDelete = useCallback((): void => {
		setUsers((prev) => prev.filter((user) => !selectedIds.has(user.id)));
		setSelectedIds(new Set());
	}, [selectedIds]);

	const handleSelectAll = useCallback((): void => {
		if (selectedIds.size === users.length) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(users.map((user) => user.id)));
		}
	}, [selectedIds.size, users]);

	const handleClearSearch = useCallback((): void => {
		setSearchQuery('');
		setUsers([]);
		setError(null);
		setPage(1);
		setHasMore(true);
		setSelectedIds(new Set());
	}, []);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>): void => {
			setSearchQuery(e.target.value);
		},
		[]
	);

	return (
		<div className="app">
			<header className="app-header">
				<h1>Github Search</h1>
			</header>

			<SearchBar
				value={searchQuery}
				onChange={handleSearchChange}
				onClear={handleClearSearch}
			/>

			<div className="main-content">
				<div className={`selection-bar ${isEditMode ? 'edit-active' : ''}`}>
					<div className="left-controls">
						<button
							className={`edit-btn ${isEditMode ? 'active' : ''}`}
							onClick={() => setIsEditMode(!isEditMode)}
							type="button"
						>
							{isEditMode ? '🔒 Quitter' : '✏️ Mode édition'}
						</button>

						{isEditMode && (
							<label className="select-all">
								<input
									type="checkbox"
									checked={
										selectedIds.size === users.length &&
										users.length > 0
									}
									onChange={handleSelectAll}
								/>
								<span>📋 {selectedIds.size} sélectionnés</span>
							</label>
						)}
					</div>

					{isEditMode && (
						<div className="action-buttons">
							<button
								className="action-btn"
								onClick={handleDuplicate}
								disabled={selectedIds.size === 0}
								title="Dupliquer la sélection"
								type="button"
							>
								📋
							</button>
							<button
								className="action-btn delete-btn"
								onClick={handleDelete}
								disabled={selectedIds.size === 0}
								title="Supprimer la sélection"
								type="button"
							>
								🗑️
							</button>
						</div>
					)}
				</div>

				<div
					className={`users-container ${isEditMode ? 'edit-active' : ''} ${
						users.length === 0 ? 'empty-state' : ''
					}`}
				>
					{loading && users.length === 0 && (
						<div className="status-message">
							<p>🔍 Recherche en cours...</p>
						</div>
					)}

					{error && !loading && users.length === 0 && (
						<div className="error-message">
							<p> {error}</p>
							<small>
								Essayez une autre recherche ou patientez quelques
								minutes.
							</small>
						</div>
					)}

					{/* État initial - pas de recherche */}
					{!loading && !error && users.length === 0 && !debouncedQuery && (
						<div className="empty-display">
							<h2>Recherchez des utilisateurs GitHub</h2>
							<p>
								Tapez un nom d'utilisateur dans la barre de recherche
							</p>
						</div>
					)}

					{/* Aucun résultat trouvé */}
					{!loading && !error && users.length === 0 && debouncedQuery && (
						<div className="empty-display">
							<h2>Aucun résultat trouvé</h2>
							<p>Aucun utilisateur trouvé pour "{debouncedQuery}"</p>
						</div>
					)}

					{/* Cartes utilisateurs */}
					{users.map((user) => (
						<UserCard
							key={`${user.id}-${user.isDuplicate ? 'dup' : 'orig'}`}
							user={user}
							isEditMode={isEditMode}
							isSelected={selectedIds.has(user.id)}
							onToggleSelection={toggleSelection}
						/>
					))}

					{loading && users.length > 0 && (
						<div className="loading-more">
							<p>Chargement de plus d'utilisateurs...</p>
						</div>
					)}

					{!hasMore && users.length > 0 && (
						<div className="end-message">
							<p> Tous les résultats ont été chargés</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
