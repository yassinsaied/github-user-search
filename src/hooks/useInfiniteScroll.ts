import { useState, useEffect, useCallback } from 'react';
import { UseInfiniteScrollReturn } from '../types';

export const useInfiniteScroll = (
	callback: () => Promise<void>
): UseInfiniteScrollReturn => {
	const [isFetching, setIsFetching] = useState<boolean>(false);

	useEffect(() => {
		if (!isFetching) return;
		fetchMoreData();
	}, [isFetching]);

	const fetchMoreData = useCallback(async (): Promise<void> => {
		await callback();
		setIsFetching(false);
	}, [callback]);

	useEffect(() => {
		const handleScroll = (): void => {
			const container = document.querySelector(
				'.users-container'
			) as HTMLElement;
			if (!container) return;

			if (
				container.scrollTop + container.clientHeight >=
				container.scrollHeight - 100
			) {
				setIsFetching(true);
			}
		};

		const container = document.querySelector(
			'.users-container'
		) as HTMLElement;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => container.removeEventListener('scroll', handleScroll);
		}
	}, []);

	return [isFetching, setIsFetching];
};
