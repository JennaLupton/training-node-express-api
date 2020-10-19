const { Connection } = require('./connection');

const createRecipeIngredient = async (recipeIngredient) => {
  const sql = `INSERT INTO recipe_ingredients (ingredient_id, recipe_id, name) 
               VALUES ($1, $2, $3)`;
  return Connection.run(sql, [
    recipeIngredient.ingredient_id,
    recipeIngredient.recipe_id,
    recipeIngredient.name,
  ]);
};

const deleteRecipeIngredient = async (id) => {
  const sql = `DELETE FROM recipe_ingredients 
               WHERE recipe_ingredient_id = $1`;
  return Connection.run(sql, [id]);
};

const getRecipeIngredients = async (recipeId) => {
  const sql = `SELECT recipe_ingredient_id, ingredient_id, recipe_id, name 
               FROM recipe_ingredients 
               WHERE recipe_id = $1
               ORDER BY ingredient_id`;
  return Connection.all(sql, [recipeId]);
};

const getRecipeIngredient = async (id) => {
  const sql = `SELECT recipe_ingredient_id, ingredient_id, recipe_id, name 
               FROM recipe_ingredients 
               WHERE recipe_ingredient_id = $1
               ORDER BY ingredient_id`;
  return Connection.get(sql, [id]);
};

const updateRecipeIngredient = async (id, recipeIngredient) => {
  const sql = `UPDATE recipe_ingredients
               SET ingredient_id = $1, name = $2
               WHERE recipe_ingredient_id = $3`;
  return Connection.run(sql, [recipeIngredient.ingredient_id, recipeIngredient.name, id]);
};

module.exports = {
  createRecipeIngredient,
  deleteRecipeIngredient,
  getRecipeIngredients,
  getRecipeIngredient,
  updateRecipeIngredient,
};
