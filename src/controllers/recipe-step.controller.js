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
// Steps that no longer exist are deleted, existing ones are upadted and new ones created
// TODO: Renumber recipe steps upon update
const updateRecipeSteps = async (recipeId, currentSteps) => {
  const stepsToDelete = (await recipeStepConnector.getRecipeSteps(recipeId)).filter(
    (step) => !currentSteps.some((item) => item.recipe_step_id === step.recipe_step_id)
  );

  const updatedSteps = [];

  for (let i = 0; i < currentSteps.length; i++) {
    const step = currentSteps[i];
    if (i !== 0) {
      step.step_number = currentSteps[i - 1].step_number + 1;
    }
    updatedSteps.push(step);
  }

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

  const changes = (await Promise.all(promises)).reduce((prev, curr) => prev + curr.changes, 0);
  return { changes, currentSteps };
};

module.exports = {
  createRecipeStep,
  deleteRecipeStep,
  getRecipeSteps,
  getRecipeStep,
  updateRecipeStep,
  updateRecipeSteps,
};
