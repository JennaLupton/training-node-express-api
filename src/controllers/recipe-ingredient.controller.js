const recipeIngredientConnector = require('../connectors/recipe-ingredient.connector');
const { BadRequestException } = require('../utils/errors');

const createRecipeIngredient = async (recipeId, recipeIngredient) =>
  recipeIngredientConnector.createRecipeIngredient({ recipe_id: recipeId, ...recipeIngredient });

const deleteRecipeIngredient = async (id) => recipeIngredientConnector.deleteRecipeIngredient(id);

const getRecipeIngredients = async (recipeId) =>
  recipeIngredientConnector.getRecipeIngredients(recipeId);

const getRecipeIngredient = async (id) => recipeIngredientConnector.getRecipeIngredient(id);

const updateRecipeIngredient = async (id, recipeIngredient) => {
  if (recipeIngredient.recipe_id && recipeIngredient.recipe_id !== id) {
    throw new BadRequestException('Cannot change recipe for recipe ingredient');
  }
  return recipeIngredientConnector.updateRecipeIngredient(id, recipeIngredient);
};

const updateRecipeIngredients = async (recipeId, submittedIngredients) => {
  const ingredientsToDelete = (
    await recipeIngredientConnector.getRecipeIngredients(recipeId)
  ).filter(
    (ingredient) =>
      !submittedIngredients.some(
        (item) => item.recipe_ingredient_id === ingredient.recipe_ingredient_id
      )
  );

  const updatedIngredients = submittedIngredients.map((ingredient, index) =>
    Object.assign(ingredient, { ingredient_number: index + 1 })
  );

  const promises = ingredientsToDelete.map((ingredient) =>
    recipeIngredientConnector.deleteRecipeIngredient(ingredient.recipe_ingredient_id)
  );

  updatedIngredients.forEach((ingredient) => {
    if (ingredient.recipe_ingredient_id) {
      promises.push(
        recipeIngredientConnector.updateRecipeIngredient(
          ingredient.recipe_ingredient_id,
          ingredient
        )
      );
    } else {
      promises.push(createRecipeIngredient(recipeId, ingredient));
    }
  });

  try {
    const changes = (await Promise.all(promises)).reduce((prev, curr) => prev + curr.changes, 0);
    return { changes, currentIngredients: submittedIngredients };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  createRecipeIngredient,
  deleteRecipeIngredient,
  getRecipeIngredients,
  getRecipeIngredient,
  updateRecipeIngredient,
  updateRecipeIngredients,
};
