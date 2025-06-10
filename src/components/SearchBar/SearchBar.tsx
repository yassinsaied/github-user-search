import React from 'react';
import { SearchBarProps } from '../../types';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => {
	return (
		<div className="search-bar">
			<div className="search-input-container">
				<input
					type="text"
					placeholder="Rechercher des utilisateurs GitHub..."
					value={value}
					onChange={onChange}
					className="search-input"
				/>
				{value && (
					<button
						className="clear-btn"
						onClick={onClear}
						title="Effacer la recherche"
						type="button"
					>
						✕
					</button>
				)}
				<div className="search-icon">🔍</div>
			</div>
		</div>
	);
};

export default SearchBar;
