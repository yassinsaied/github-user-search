import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css'; // ✅ Un seul import
import App from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
