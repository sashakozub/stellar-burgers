
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const HAR_PATH = path.resolve('tests/fixtures/ingredients.har');
const USER_PATH = path.resolve('tests/fixtures/user.json');
const ORDER_PATH = path.resolve('tests/fixtures/order.json');

const bunName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';

// Находим карточку ингредиента и нажимаем "Добавить"
const addIngredient = async (page: Page, name: string) => {
  const ingredientCard = page.locator('li').filter({
    has: page.getByRole('link', { name })
  });

  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

// Открываем модальное окно ингредиента
const openIngredientModal = async (page: Page) => {
  await page.getByRole('link', { name: bunName }).click();

  await expect(
    page.getByRole('heading', { name: 'Детали ингредиента' })
  ).toBeVisible();
};

test.describe('Конструктор бургеров', () => {
  test.beforeEach(async ({ page }) => {
    // Подменяем запрос ингредиентов HAR-файлом
    await page.routeFromHAR(HAR_PATH, {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort'
    });

    // Открываем главную страницу
    await page.goto('/');

    // Проверяем загрузку ингредиентов
    await expect(
      page.getByText(bunName).first()
    ).toBeVisible();
  });

  // ТЕСТ 1
  test('Отображение ингредиентов', async ({ page }) => {
    await expect(
      page.getByText(bunName).first()
    ).toBeVisible();

    await expect(
      page.getByText(fillingName).first()
    ).toBeVisible();
  });

  // ТЕСТ 2
  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);

    // Проверяем верхнюю булку
    await expect(
      page.getByText(`${bunName} (верх)`)
    ).toBeVisible();

    // Проверяем нижнюю булку
    await expect(
      page.getByText(`${bunName} (низ)`)
    ).toBeVisible();

    // Проверяем начинку
    await expect(
      page.getByText(fillingName).last()
    ).toBeVisible();
  });

  // ТЕСТ 3
  test('Открытие модального окна ингредиента', async ({ page }) => {
    await openIngredientModal(page);

    await expect(
      page.getByRole('button', { name: 'Закрыть' })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/ingredients\//);
  });

  // ТЕСТ 4
  test('Закрытие модального окна крестиком', async ({ page }) => {
    await openIngredientModal(page);

    // Нажимаем на иконку закрытия
    await page
      .getByRole('button', { name: 'Закрыть' })
      .locator('svg')
      .click();

    // Проверяем, что окно исчезло
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();

    await expect(page).toHaveURL('/');
  });

  // ТЕСТ 5
  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await openIngredientModal(page);

    // Нажимаем на затемнённую область
    await page
      .locator('[class*="modal-overlay__overlay"]')
      .click({ position: { x: 5, y: 5 } });

    // Проверяем закрытие модального окна
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();

    await expect(page).toHaveURL('/');
  });

  // ТЕСТ 6
  test('Оформление заказа и очистка конструктора', async ({
    page,
    context
  }) => {
    // Подменяем ответ API пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        path: USER_PATH
      });
    });

    // Подменяем ответ API создания заказа
    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          path: ORDER_PATH
        });
      } else {
        await route.continue();
      }
    });

    // Устанавливаем тестовый accessToken
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://127.0.0.1:4000'
      }
    ]);

    // Устанавливаем refreshToken до загрузки приложения
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    // Перезагружаем страницу с установленными токенами
    await page.reload();

    await expect(
      page.getByText(bunName).first()
    ).toBeVisible();

    // Собираем бургер
    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);

    await expect(
      page.getByText(`${bunName} (верх)`)
    ).toBeVisible();

    await expect(
      page.getByText(`${bunName} (низ)`)
    ).toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', {
      name: 'Оформить заказ'
    }).click();

    // Проверяем номер заказа
    await expect(
      page.getByRole('heading', { name: '12345' })
    ).toBeVisible();

    await expect(
      page.getByText('идентификатор заказа')
    ).toBeVisible();

    // Проверяем, что конструктор очистился
    await expect(
      page.getByText('Выберите булки').first()
    ).toBeVisible();

    await expect(
      page.getByText('Выберите начинку')
    ).toBeVisible();

    // Закрываем окно заказа
    await page
      .getByRole('button', { name: 'Закрыть' })
      .locator('svg')
      .click();

    // Проверяем успешное закрытие
    await expect(
      page.getByRole('heading', { name: '12345' })
    ).not.toBeVisible();
  });
});
