import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
	const mockOnChange = vi.fn();
	const mockOnClear = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('affiche le champ de recherche avec le placeholder', () => {
		render(
			<SearchBar value="" onChange={mockOnChange} onClear={mockOnClear} />
		);

		expect(
			screen.getByPlaceholderText('Rechercher des utilisateurs GitHub...')
		).toBeInTheDocument();
	});

	it('affiche la valeur actuelle', () => {
		render(
			<SearchBar
				value="requête test"
				onChange={mockOnChange}
				onClear={mockOnClear}
			/>
		);

		expect(screen.getByDisplayValue('requête test')).toBeInTheDocument();
	});

	it("appelle onChange quand l'utilisateur tape", async () => {
		const utilisateur = userEvent.setup();
		render(
			<SearchBar value="" onChange={mockOnChange} onClear={mockOnClear} />
		);

		const champSaisie = screen.getByPlaceholderText(
			'Rechercher des utilisateurs GitHub...'
		);
		await utilisateur.type(champSaisie, 'react');

		expect(mockOnChange).toHaveBeenCalledTimes(5); // r-e-a-c-t = 5 caractères
	});

	it("montre le bouton effacer quand la valeur n'est pas vide", () => {
		render(
			<SearchBar
				value="test"
				onChange={mockOnChange}
				onClear={mockOnClear}
			/>
		);

		expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
	});

	it('cache le bouton effacer quand la valeur est vide', () => {
		render(
			<SearchBar value="" onChange={mockOnChange} onClear={mockOnClear} />
		);

		expect(
			screen.queryByRole('button', { name: '✕' })
		).not.toBeInTheDocument();
	});

	it('appelle onClear quand le bouton effacer est cliqué', async () => {
		const utilisateur = userEvent.setup();
		render(
			<SearchBar
				value="test"
				onChange={mockOnChange}
				onClear={mockOnClear}
			/>
		);

		const boutonEffacer = screen.getByRole('button', { name: '✕' });
		await utilisateur.click(boutonEffacer);

		expect(mockOnClear).toHaveBeenCalledTimes(1);
	});

	it('appelle onClear quand le bouton effacer est cliqué - par title', async () => {
		const utilisateur = userEvent.setup();
		render(
			<SearchBar
				value="test"
				onChange={mockOnChange}
				onClear={mockOnClear}
			/>
		);

		const boutonEffacer = screen.getByTitle('Effacer la recherche');
		await utilisateur.click(boutonEffacer);

		expect(mockOnClear).toHaveBeenCalledTimes(1);
	});

	it('appelle onClear quand le bouton effacer est cliqué - par texte', async () => {
		const utilisateur = userEvent.setup();
		render(
			<SearchBar
				value="test"
				onChange={mockOnChange}
				onClear={mockOnClear}
			/>
		);

		const boutonEffacer = screen.getByText('✕');
		await utilisateur.click(boutonEffacer);

		expect(mockOnClear).toHaveBeenCalledTimes(1);
	});
});
