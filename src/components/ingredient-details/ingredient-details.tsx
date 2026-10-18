import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
