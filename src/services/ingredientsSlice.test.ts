import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '123',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
  };

  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  test('Возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual(initialState);
  });

  test('Обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled([mockIngredient], '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  test('Обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка сервера'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
