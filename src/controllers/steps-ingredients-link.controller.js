const stepIngredientConnector = require('../connectors/steps-ingredients-link.connector');

const createStepIngredient = async (stepId, stepIngredient) =>
    stepIngredientConnector.createStepIngredient({ recipe_step_id: stepId, ...stepIngredient });

const deleteStepIngredient = async (id) => stepIngredientConnector.deleteStepIngredient(id);

const getStepIngredients = async (stepId) => {
    return stepIngredientConnector.getStepIngredients(stepId)};

const getStepIngredient = async (id) => stepIngredientConnector.getStepIngredient(id);

// Updates the current step ingredients using the supplied array
// Ingredients that no longer exist are deleted and new ones are created
const updateStepIngredients = async (stepId, submittedStepIngredients) => {
    const currentStepIngredients = await getStepIngredients(stepId);

    const stepIngredientsToDelete = currentStepIngredients.filter(
            (stepIngredient) => !submittedStepIngredients.some(
                (item) => item.recipe_ingredient_id === stepIngredient.recipe_ingredient_id 
                    && item.recipe_step_id === stepIngredient.recipe_step_id)
    );

    const promisesDelete = stepIngredientsToDelete.map((stepIngredient) =>
        deleteStepIngredient(stepIngredient.recipe_ingredient_id)
    );

    const stepIngredientsToAdd = submittedStepIngredients.filter(
            (stepIngredient) => !currentStepIngredients.some(
                (item) => item.recipe_ingredient_id === stepIngredient.recipe_ingredient_id 
                    && item.recipe_step_id === stepIngredient.recipe_step_id)
    );

    const promisesAdd = stepIngredientsToAdd.map((stepIngredient) =>
        createStepIngredient(stepIngredient.recipe_step_id, stepIngredient.recipe_ingredient_id)
    );

    try {
        const changes = (await Promise.all(promisesDelete.concat(promisesAdd))).reduce(
            (prev, curr) => prev + curr.changes, 0);
        return { changes, currentStepIngredients: submittedStepIngredients };
    }   catch (e) {
            return { error: e};
        }
};

module.exports = {
  createStepIngredient,
  deleteStepIngredient,
  getStepIngredients,
  getStepIngredient,
  updateStepIngredients,
};