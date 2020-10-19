const express = require('express');
const stepIngredientsController = require('../controllers/step-ingredients.controller');
const { CustomException } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

// Accepts the step ingredient submitted and calls the controller to persist it
router.post('/', async (req, res) => {
  const result = await stepIngredientsController.createStepIngredient(
    req.params.recipeStepId,
    req.body
  );
  res.setHeader('Location', `/${result.recipe_step_id}`);
  res.status(201).send(result);
});

// Calls the controller to delete the step ingredient corresponding to the ID in the URL
router.delete('/:id', async (req, res) => {
  const result = await stepIngredientsController.deleteStepIngredient(req.params.id);
  res.send(result);
});

// Gets the ingredients for the step referred to in the URL (defined in parent router)
router.get('/', async (req, res) => {
  const { recipeStepId } = req.params;
  const result = await stepIngredientsController.getStepIngredients(recipeStepId);
  res.send(result);
});

// Gets an individual step ingredient according to the ID supplied in the URL
router.get('/:id', async (req, res) => {
  const result = await stepIngredientsController.getStepIngredient(req.params.id);
  res.send(result);
});

router.patch('/', async (req, res, next) => {
  try {
    const { recipeStepId } = req.params;
    res.send(await stepIngredientsController.updateStepIngredients(recipeStepId, req.body));
  } catch (err) {
    next(new CustomException('Unable to create recipe step', err));
  }
});

module.exports = router;
