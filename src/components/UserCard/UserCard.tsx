import React from 'react';
import { UserCardProps } from '../../types';
import './UserCard.css';

const UserCard: React.FC<UserCardProps> = ({
	user,
	isEditMode,
	isSelected,
	onToggleSelection,
}) => {
	const handleProfileClick = (): void => {
		window.open(user.html_url, '_blank', 'noopener,noreferrer');
	};

	const handleCheckboxChange = (): void => {
		onToggleSelection(user.id);
	};

	return (
		<div className={`user-card ${user.isDuplicate ? 'duplicate' : ''}`}>
			{isEditMode && (
				<div className="card-checkbox">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={handleCheckboxChange}
					/>
				</div>
			)}

			<img
				src={user.avatar_url}
				alt={`${user.login} avatar`}
				className="user-avatar"
			/>

			<div className="user-info">
				<div className="user-id">ID: {user.id}</div>
				<div className="user-login">{user.login}</div>
				{user.isDuplicate && <div className="duplicate-badge">Copie</div>}
			</div>

			<button
				className="profile-btn"
				onClick={handleProfileClick}
				type="button"
			>
				Voir le profil
			</button>
		</div>
	);
};

export default UserCard;
