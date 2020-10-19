jest.mock('../connectors/step_ingredients.connector.js');
const {
  getStepIngredients,
  deleteStepIngredient,
  createStepIngredient,
} = require('../connectors/step_ingredients.connector.js');

getStepIngredients.mockReturnValue(
  Promise.resolve([
    {
      recipe_step_id: 1,
      recipe_ingredient_id: 1,
    },
    {
      recipe_step_id: 1,
      recipe_ingredient_id: 2,
    },
  ])
);
deleteStepIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
createStepIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
const { updateStepIngredients } = require('./step-ingredients.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Updating step ingredients', () => {
  test('Create a step ingredient', async () => {
    const result = await updateStepIngredients(1, [
      {
        recipe_step_id: 1,
        recipe_ingredient_id: 1,
      },
      {
        recipe_step_id: 1,
        recipe_ingredient_id: 2,
      },
      {
        recipe_step_id: 2,
        recipe_ingredient_id: 1,
      },
    ]);
    expect(result.changes).toEqual(1);
    expect(getStepIngredients.mock.calls.length).toEqual(1);
    expect(deleteStepIngredient.mock.calls.length).toEqual(0);
    expect(createStepIngredient.mock.calls.length).toEqual(1);
  });

  test('Delete a step ingredient', async () => {
    const result = await updateStepIngredients(1, [
      {
        recipe_step_id: 1,
        recipe_ingredient_id: 1,
      },
    ]);
    expect(result.changes).toEqual(1);
    expect(getStepIngredients.mock.calls.length).toEqual(1);
    expect(deleteStepIngredient.mock.calls.length).toEqual(1);
    expect(createStepIngredient.mock.calls.length).toEqual(0);
  });

    test('Delete and create step ingredients', async () => {
    const result = await updateStepIngredients(1, [
       {
        recipe_step_id: 7,
        recipe_ingredient_id: 7,
      },
      {
        recipe_step_id: 6,
        recipe_ingredient_id: 2,
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(getStepIngredients.mock.calls.length).toEqual(1);
    expect(deleteStepIngredient.mock.calls.length).toEqual(2);
    expect(createStepIngredient.mock.calls.length).toEqual(2);
  });
});
