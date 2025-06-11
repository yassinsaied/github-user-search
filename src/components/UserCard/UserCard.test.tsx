import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserCard from './UserCard';
import { GitHubUser } from '../../types';

describe('UserCard', () => {
	const utilisateurTest: GitHubUser = {
		id: 12345,
		login: 'testuser',
		avatar_url: 'https://example.com/avatar.jpg',
		html_url: 'https://github.com/testuser',
		type: 'User',
	};

	const mockOnToggleSelection = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock window.open
		Object.defineProperty(window, 'open', {
			value: vi.fn(),
			writable: true,
		});
	});

	it("ouvre l'URL du profil quand le bouton profil est cliqué", async () => {
		const utilisateur = userEvent.setup();
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		const boutonProfil = screen.getByText('Voir le profil');
		await utilisateur.click(boutonProfil);

		expect(window.open).toHaveBeenCalledWith(
			'https://github.com/testuser',
			'_blank',
			'noopener,noreferrer'
		);
	});

	it('affiche correctement les informations utilisateur', () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.getByText('testuser')).toBeInTheDocument();
		expect(screen.getByText('ID: 12345')).toBeInTheDocument();
		expect(screen.getByAltText('testuser avatar')).toBeInTheDocument();
		expect(screen.getByText('Voir le profil')).toBeInTheDocument();
	});

	it('montre la case à cocher en mode édition', () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={true}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.getByRole('checkbox')).toBeInTheDocument();
	});

	it('cache la case à cocher quand pas en mode édition', () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
	});

	it("la case à cocher est cochée quand l'utilisateur est sélectionné", () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={true}
				isSelected={true}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('appelle onToggleSelection quand la case à cocher est cliquée', async () => {
		const utilisateur = userEvent.setup();
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={true}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		const caseACocher = screen.getByRole('checkbox');
		await utilisateur.click(caseACocher);

		expect(mockOnToggleSelection).toHaveBeenCalledWith(12345);
	});

	it('montre le badge de duplication pour les utilisateurs dupliqués', () => {
		const utilisateurDuplique: GitHubUser = {
			...utilisateurTest,
			isDuplicate: true,
		};

		render(
			<UserCard
				user={utilisateurDuplique}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.getByText('Copie')).toBeInTheDocument();
	});

	it("affiche l'avatar avec les bonnes propriétés src et alt", () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		const avatar = screen.getByAltText('testuser avatar');
		expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
	});

	it("affiche l'ID utilisateur dans le bon format", () => {
		render(
			<UserCard
				user={utilisateurTest}
				isEditMode={false}
				isSelected={false}
				onToggleSelection={mockOnToggleSelection}
			/>
		);

		expect(screen.getByText('ID: 12345')).toBeInTheDocument();
	});
});
