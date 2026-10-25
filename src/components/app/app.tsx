import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.ingredients);

  // Получаем страницу, с которой пользователь открыл модальное окно
  const background = location.state?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            isLoading ? (
              <Preloader />
            ) : error ? (
              <p>Ошибка загрузки ингредиентов: {error}</p>
            ) : (
              <ConstructorPage />
            )
          }
        />

        <Route path="/feed" element={<Feed />} />

        {/* Прямая ссылка на заказ из ленты */}
        <Route
          path="/feed/:number"
          element={
            <div className={styles.detailPageWrap}>
              <h2 className={styles.detailHeader}>
                Информация о заказе
              </h2>
              <OrderInfo />
            </div>
          }
        />

        {/* Прямая ссылка на ингредиент */}
        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h2 className={styles.detailHeader}>
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />

        <Route element={<ProtectedRoute isGuest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />

          {/* Прямая ссылка на заказ из истории */}
          <Route
            path="/profile/orders/:number"
            element={
              <div className={styles.detailPageWrap}>
                <h2 className={styles.detailHeader}>
                  Информация о заказе
                </h2>
                <OrderInfo />
              </div>
            }
          />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна поверх предыдущей страницы */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={
                <Modal title="Информация о заказе" onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;