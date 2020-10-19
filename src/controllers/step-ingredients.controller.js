const stepIngredientConnector = require('../connectors/step_ingredients.connector');

const createStepIngredient = async (recipeStepId, recipeIngredient) =>
  stepIngredientConnector.createStepIngredient({
    recipe_step_id: recipeStepId,
    ...recipeIngredient,
  });

const deleteStepIngredient = async (id) => stepIngredientConnector.deleteStepIngredient(id);

const getStepIngredients = async (recipeStepId) =>
  stepIngredientConnector.getStepIngredients(recipeStepId);

const getStepIngredient = async (id) => stepIngredientConnector.getStepIngredient(id);

const updateStepIngredients = async (recipeStepId, submittedStepIngredients) => {
  const currentStepIngredients = await getStepIngredients(recipeStepId);

  const stepIngredientsToDelete = currentStepIngredients.filter(
    (stepIngredient) =>
      !submittedStepIngredients.some(
        (item) =>
          item.recipe_ingredient_id === stepIngredient.recipe_ingredient_id &&
          item.recipe_step_id === stepIngredient.recipe_step_id
      )
  );

  const promisesDelete = stepIngredientsToDelete.map((stepIngredient) =>
    deleteStepIngredient(stepIngredient.recipe_ingredient_id)
  );

  const stepIngredientsToAdd = submittedStepIngredients.filter(
    (stepIngredient) =>
      !currentStepIngredients.some(
        (item) =>
          item.recipe_ingredient_id === stepIngredient.recipe_ingredient_id &&
          item.recipe_step_id === stepIngredient.recipe_step_id
      )
  );

  const promisesAdd = stepIngredientsToAdd.map((stepIngredient) =>
    createStepIngredient(stepIngredient.recipe_step_id, stepIngredient.recipe_ingredient_id)
  );

  try {
    const changes = (await Promise.all(promisesDelete.concat(promisesAdd))).reduce(
      (prev, curr) => prev + curr.changes,
      0
    );
    return { changes, currentStepIngredients: submittedStepIngredients };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  createStepIngredient,
  deleteStepIngredient,
  getStepIngredients,
  getStepIngredient,
  updateStepIngredients,
};
