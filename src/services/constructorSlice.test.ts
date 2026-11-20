import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from './constructorSlice';

import type {
  TIngredient,
  TConstructorIngredient,
  TConstructorState,
} from '@utils-types';

// Моковая булка
const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png',
};

// Моковая начинка
const mockFilling: TIngredient = {
  _id: 'filling-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'meat.png',
  image_mobile: 'meat-mobile.png',
  image_large: 'meat-large.png',
};

// Вторая начинка
const mockFilling2: TIngredient = {
  ...mockFilling,
  _id: 'filling-2',
  name: 'Говяжий метеорит',
};

// Начальное состояние конструктора
const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

describe('constructorSlice', () => {
  // ТЕСТ 1. Неизвестный экшен
  test('Возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual(initialState);
  });

  // ТЕСТ 2. Добавление булки
  test('Добавление булки в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(typeof state.bun?.id).toBe('string');

    expect(state.ingredients).toEqual([]);
  });

  // ТЕСТ 3. Добавление начинки
  test('Добавление начинки в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(mockFilling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toMatchObject(mockFilling);
    expect(typeof state.ingredients[0].id).toBe('string');
  });

  // ТЕСТ 4. Замена булки
  test('Замена булки при повторном добавлении', () => {
    const firstState = constructorReducer(initialState, addIngredient(mockBun));

    const secondBun: TIngredient = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Флюоресцентная булка R2-D3',
    };

    const secondState = constructorReducer(firstState, addIngredient(secondBun));

    expect(secondState.bun?._id).toBe('bun-2');
    expect(secondState.ingredients).toEqual([]);
  });

  // ТЕСТ 5. Удаление ингредиента
  test('Удаление ингредиента из конструктора', () => {
    const filling: TConstructorIngredient = {
      ...mockFilling,
      id: 'test-id-1',
    };

    const stateWithFilling: TConstructorState = {
      bun: null,
      ingredients: [filling],
    };

    const state = constructorReducer(stateWithFilling, removeIngredient('test-id-1'));

    expect(state.ingredients).toEqual([]);
  });

  // ТЕСТ 6. Перемещение вверх
  test('Перемещение ингредиента вверх', () => {
    const first: TConstructorIngredient = {
      ...mockFilling,
      id: 'id-1',
    };

    const second: TConstructorIngredient = {
      ...mockFilling2,
      id: 'id-2',
    };

    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [first, second],
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientUp(1));

    expect(state.ingredients).toEqual([second, first]);
  });

  // ТЕСТ 7. Перемещение вниз
  test('Перемещение ингредиента вниз', () => {
    const first: TConstructorIngredient = {
      ...mockFilling,
      id: 'id-1',
    };

    const second: TConstructorIngredient = {
      ...mockFilling2,
      id: 'id-2',
    };

    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [first, second],
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientDown(0));

    expect(state.ingredients).toEqual([second, first]);
  });

  // ТЕСТ 8. Нельзя переместить первый элемент выше
  test('Нельзя переместить первый ингредиент выше', () => {
    const first: TConstructorIngredient = {
      ...mockFilling,
      id: 'id-1',
    };

    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [first],
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientUp(0));

    expect(state.ingredients).toEqual([first]);
  });

  // ТЕСТ 9. Нельзя переместить последний элемент ниже
  test('Нельзя переместить последний ингредиент ниже', () => {
    const first: TConstructorIngredient = {
      ...mockFilling,
      id: 'id-1',
    };

    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [first],
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientDown(0));

    expect(state.ingredients).toEqual([first]);
  });

  // ТЕСТ 10. Очистка конструктора
  test('Очистка конструктора', () => {
    const bun: TConstructorIngredient = {
      ...mockBun,
      id: 'bun-id',
    };

    const filling: TConstructorIngredient = {
      ...mockFilling,
      id: 'filling-id',
    };

    const stateWithIngredients: TConstructorState = {
      bun,
      ingredients: [filling],
    };

    const state = constructorReducer(stateWithIngredients, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
