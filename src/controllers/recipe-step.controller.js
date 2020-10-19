const recipeStepConnector = require('../connectors/recipe-step.connector');
const { BadRequestException } = require('../utils/errors');

const createRecipeStep = async (recipeId, recipeStep) =>
  recipeStepConnector.createRecipeStep({ recipe_id: recipeId, ...recipeStep });

const deleteRecipeStep = async (id) => recipeStepConnector.deleteRecipeStep(id);

const getRecipeSteps = async (recipeId) => recipeStepConnector.getRecipeSteps(recipeId);

const getRecipeStep = async (id) => recipeStepConnector.getRecipeStep(id);

const updateRecipeStep = async (id, recipeStep) => {
  if (recipeStep.recipe_id && recipeStep.recipe_id !== id) {
    throw new BadRequestException('Cannot change recipe for recipe step');
  }
  return recipeStepConnector.updateRecipeStep(id, recipeStep);
};

// Updates the current recipe steps using the supplied array
// Steps that no longer exist are deleted, existing ones are updated and new ones created
const updateRecipeSteps = async (recipeId, submittedSteps) => {
  const stepsToDelete = (await recipeStepConnector.getRecipeSteps(recipeId)).filter(
    (step) => !submittedSteps.some((item) => item.recipe_step_id === step.recipe_step_id)
  );

  const updatedSteps = submittedSteps.map((step, index) =>
    Object.assign(step, { step_number: index + 1 })
  );

  const promises = stepsToDelete.map((step) =>
    recipeStepConnector.deleteRecipeStep(step.recipe_step_id)
  );

  updatedSteps.forEach((step) => {
    if (step.recipe_step_id) {
      promises.push(recipeStepConnector.updateRecipeStep(step.recipe_step_id, step));
    } else {
      promises.push(createRecipeStep(recipeId, step));
    }
  });

  try {
    const changes = (await Promise.all(promises)).reduce((prev, curr) => prev + curr.changes, 0);
    return { changes, currentSteps: submittedSteps };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  createRecipeStep,
  deleteRecipeStep,
  getRecipeSteps,
  getRecipeStep,
  updateRecipeStep,
  updateRecipeSteps,
};
