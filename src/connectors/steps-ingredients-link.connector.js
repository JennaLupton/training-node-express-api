const { Connection } = require('./connection');

const createStepIngredient = async (stepIngredient) => {
  const sql = `INSERT INTO steps_ingredients_link (recipe_step_id, recipe_ingredient_id) 
               VALUES ($1, $2)`;
  return Connection.run(sql, 
    [stepIngredient.recipe_step_id, stepIngredient.recipe_ingredient_id]);
};

const deleteStepIngredient = async (id) => {
  const sql = `DELETE FROM steps_ingredients_link 
               WHERE recipe_ingredient_id = $1`;
  return Connection.run(sql, [id]);
};

const getStepIngredients = async (stepId) => {
  const sql = `SELECT steps_ingredients_link.recipe_step_id, steps_ingredients_link.recipe_ingredient_id, recipe_ingredients.name
               FROM steps_ingredients_link
               INNER JOIN recipe_ingredients ON steps_ingredients_link.recipe_ingredient_id = recipe_ingredients.recipe_ingredient_id 
               WHERE recipe_step_id = $1
               ORDER BY recipe_ingredient_id`;
  return Connection.all(sql, [stepId]);
};

const getStepIngredient = async (id) => {
  const sql = `SELECT steps_ingredients_link.recipe_step_id, steps_ingredients_link.recipe_ingredient_id, recipe_ingredients.name
               FROM steps_ingredients_link
               INNER JOIN recipe_ingredients ON steps_ingredients_link.recipe_ingredient_id = recipe_ingredients.recipe_ingredient_id
               WHERE recipe_ingredient_id = $1
               ORDER BY recipe_ingredient_id`;
  return Connection.get(sql, [id]);
};

// Need to add an updateStepIngredient function

module.exports = {
  createStepIngredient,
  deleteStepIngredient,
  getStepIngredients,
  getStepIngredient,
  // updateStepIngredient
};