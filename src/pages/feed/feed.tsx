import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect, useCallback } from 'react';

import { fetchFeeds } from '../../services/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { orders, isLoading, error } = useSelector((state) => state.feed);

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p>
        Ошибка загрузки заказов:{' '}
        {error instanceof Error ? error.message : 'Не удалось загрузить заказы'}
      </p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};