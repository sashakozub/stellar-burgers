import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/userSlice';

type TLoginLocationState = {
  from?: {
    pathname: string;
  };
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const locationState = location.state as TLoginLocationState | null;
        const from = locationState?.from;

        void navigate(from?.pathname ?? '/', {
          replace: true,
        });
      })
      .catch((error: unknown) => {
        console.error('Ошибка авторизации:', error);
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
