import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        navigate('/login');
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
