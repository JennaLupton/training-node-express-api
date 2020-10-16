const express = require('express');
const stepIngredientController = require('../controllers/steps-ingredients-link.controller');

const router = express.Router({ mergeParams: true });

// Accepts the recipe ingredient submitted and calls the controller to persist it
router.post('/', async (req, res) => {
  const result = await stepIngredientController.createStepIngredient(req.params.stepId, req.body);
  res.setHeader('Location', `/${result.recipe_step_id}`);
  res.status(201).send(result);
});

// Calls the controller to delete the recipe ingredient corresponding to the ID in the URL
// TODO: Verify step belongs to recipe from which is being deleted
router.delete('/:id', async (req, res) => {
  const result = await stepIngredientController.deleteStepIngredient(req.params.id);
  res.send(result);
});

// Gets the step ingredients for the step referred to in the URL (defined in parent router)
router.get('/', async (req, res) => {
  const { stepId } = req.params;
  const result = await stepIngredientController.getStepIngredients(stepId);
  res.send(result);
});

// Gets an individual step ingredient according to the ID supplied in the URL
router.get('/:id', async (req, res) => {
  const result = await stepIngredientController.getStepIngredient(req.params.id);
  res.send(result);
});

module.exports = router;