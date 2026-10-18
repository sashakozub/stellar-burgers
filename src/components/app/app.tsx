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
import { Routes, Route, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.ingredients);

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

      <Routes>
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

        <Route
          path="/feed/:number"
          element={
            <Modal title="Информация о заказе" onClose={closeModal}>
              <OrderInfo />
            </Modal>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Детали ингредиента" onClose={closeModal}>
              <IngredientDetails />
            </Modal>
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

          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="Информация о заказе" onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
