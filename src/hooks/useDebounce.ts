import { useState, useEffect } from 'react';
import { UseDebounceReturn } from '../types';

export const useDebounce = (
	value: string,
	delay: number
): UseDebounceReturn => {
	const [debouncedValue, setDebouncedValue] = useState<string>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};
