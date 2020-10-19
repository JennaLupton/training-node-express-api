const express = require('express');
const recipeIngredientController = require('../controllers/recipe-ingredient.controller');
const { CustomException } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

// Accepts the recipe Ingredient submitted and calls the controller to persist it
router.post('/', async (req, res) => {
  const result = await recipeIngredientController.createRecipeIngredient(
    req.params.recipeId,
    req.body
  );
  res.setHeader('Location', `/${result.recipe_Ingredient_id}`);
  res.status(201).send(result);
});

// Calls the controller to delete the recipe Ingredient corresponding to the ID in the URL
// TODO: Verify Ingredient belongs to recipe from which is being deleted
router.delete('/:id', async (req, res) => {
  const result = await recipeIngredientController.deleteRecipeIngredient(req.params.id);
  res.send(result);
});

// Gets the recipe Ingredients for the recipe referred to in the URL (defined in parent router)
router.get('/', async (req, res) => {
  const { recipeId } = req.params;
  const result = await recipeIngredientController.getRecipeIngredients(recipeId);
  res.send(result);
});

// Gets an individual recipe Ingredient according to the ID supplied in the URL
router.get('/:id', async (req, res) => {
  const result = await recipeIngredientController.getRecipeIngredient(req.params.id);
  res.send(result);
});

// Updates the recipe Ingredient corresponding to the ID in the URL with the supplied data
router.put('/:id', async (req, res, next) => {
  try {
    res.send(await recipeIngredientController.updateRecipeIngredient(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    res.send(await recipeIngredientController.updateRecipeIngredients(recipeId, req.body));
  } catch (err) {
    next(new CustomException('Unable to create recipe Ingredient', err));
  }
});

module.exports = router;
