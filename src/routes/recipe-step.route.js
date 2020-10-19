const express = require('express');
const recipeStepController = require('../controllers/recipe-step.controller');
const stepIngredientsRouter = require('./step-ingredient.route');
const { CustomException } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

// Accepts the recipe step submitted and calls the controller to persist it
router.post('/', async (req, res) => {
  const result = await recipeStepController.createRecipeStep(req.params.recipeId, req.body);
  res.setHeader('Location', `/${result.recipe_step_id}`);
  res.status(201).send(result);
});

// Calls the controller to delete the recipe step corresponding to the ID in the URL
// TODO: Verify step belongs to recipe from which is being deleted
router.delete('/:id', async (req, res) => {
  const result = await recipeStepController.deleteRecipeStep(req.params.id);
  res.send(result);
});

// Gets the recipe steps for the recipe referred to in the URL (defined in parent router)
router.get('/', async (req, res) => {
  const { recipeId } = req.params;
  const result = await recipeStepController.getRecipeSteps(recipeId);
  res.send(result);
});

// Gets an individual recipe step according to the ID supplied in the URL
router.get('/:id', async (req, res) => {
  const result = await recipeStepController.getRecipeStep(req.params.id);
  res.send(result);
});

// Updates the recipe step corresponding to the ID in the URL with the supplied data
router.put('/:id', async (req, res, next) => {
  try {
    res.send(await recipeStepController.updateRecipeStep(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    res.send(await recipeStepController.updateRecipeSteps(recipeId, req.body));
  } catch (err) {
    next(new CustomException('Unable to create recipe step', err));
  }
});

router.use('/:recipeStepId/step-ingredients', stepIngredientsRouter);

module.exports = router;
