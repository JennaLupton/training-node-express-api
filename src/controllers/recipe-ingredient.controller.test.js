jest.mock('../connectors/recipe-ingredient.connector.js');
const {
  getRecipeIngredients,
  deleteRecipeIngredient,
  updateRecipeIngredient,
  createRecipeIngredient,
} = require('../connectors/recipe-ingredient.connector.js');

getRecipeIngredients.mockReturnValue(
  Promise.resolve([
    {
      recipe_ingredient_id: 1,
      ingredient_id: 1,
      recipe_id: 1,
      name: 'Flour',
    },
    {
      recipe_ingredient_id: 2,
      ingredient_id: 2,
      recipe_id: 1,
      name: 'Eggs',
    },
  ])
);
deleteRecipeIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
updateRecipeIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
createRecipeIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
const { updateRecipeIngredients } = require('./recipe-ingredient.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Update recipe ingredients collection', () => {
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeIngredients(1, [
      {
        recipe_ingredient_id: 1,
        ingredient_id: 1,
        recipe_id: 1,
        name: 'Flour',
      },
      {
        recipe_ingredient_id: null,
        ingredient_id: 3,
        recipe_id: 2,
        name: 'Sugar',
      },
    ]);
    expect(result.changes).toEqual(3);
    expect(getRecipeIngredients.mock.calls.length).toEqual(1);
    expect(updateRecipeIngredient.mock.calls.length).toEqual(1);
    expect(deleteRecipeIngredient.mock.calls.length).toEqual(1);
    expect(createRecipeIngredient.mock.calls.length).toEqual(1);
  });

  // Test for updating both recipe ingredients
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeIngredients(1, [
      {
        recipe_ingredient_id: 1,
        ingredient_id: 1,
        recipe_id: 1,
        name: 'Flour',
      },
      {
        recipe_ingredient_id: 2,
        ingredient_id: 2,
        recipe_id: 1,
        name: 'Eggs',
      },
    ]);
    expect(result.changes).toEqual(2);
    expect(getRecipeIngredients.mock.calls.length).toEqual(1);
    expect(updateRecipeIngredient.mock.calls.length).toEqual(2);
    expect(deleteRecipeIngredient.mock.calls.length).toEqual(0);
    expect(createRecipeIngredient.mock.calls.length).toEqual(0);
  });

  // Test for deleting both recipe ingredients
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeIngredients(1, []);
    expect(result.changes).toEqual(2);
    expect(getRecipeIngredients.mock.calls.length).toEqual(1);
    expect(updateRecipeIngredient.mock.calls.length).toEqual(0);
    expect(deleteRecipeIngredient.mock.calls.length).toEqual(2);
    expect(createRecipeIngredient.mock.calls.length).toEqual(0);
  });

  // Test for deleting both recipe ingredients and replacing with null records
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeIngredients(1, [
      {
        recipe_ingredient_id: null,
        ingredient_id: null,
        recipe_id: null,
        name: null,
      },
      {
        recipe_ingredient_id: null,
        ingredient_id: null,
        recipe_id: null,
        name: null,
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(getRecipeIngredients.mock.calls.length).toEqual(1);
    expect(updateRecipeIngredient.mock.calls.length).toEqual(0);
    expect(deleteRecipeIngredient.mock.calls.length).toEqual(2);
    expect(createRecipeIngredient.mock.calls.length).toEqual(2);
  });

  // Test for creating two new recipe ingredients
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeIngredients(1, [
      {
        recipe_ingredient_id: null,
        ingredient_id: 4,
        recipe_id: 3,
        name: 'Milk',
      },
      {
        recipe_ingredient_id: null,
        ingredient_id: 3,
        recipe_id: 1,
        name: 'Sugar',
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(getRecipeIngredients.mock.calls.length).toEqual(1);
    expect(updateRecipeIngredient.mock.calls.length).toEqual(0);
    expect(deleteRecipeIngredient.mock.calls.length).toEqual(2);
    expect(createRecipeIngredient.mock.calls.length).toEqual(2);
  });

  test ('Error throw returned if deletion fails', async () => {
    // Given
    const newIngredients = [
      {
        recipe_ingredient_id: 1,
        ingredient_id: 1,
        recipe_id: 1,
        name: 'Flour',
      },
    ];
    deleteRecipeIngredient.mockImplementation(() => 
    Promise.reject(new Error("Failed to delete recipe ingredient")));

    // When
    const result = await updateRecipeIngredients(1, newIngredients);

    // Then
    expect(result.error.message).toEqual("Failed to delete recipe ingredient");
  });

  test ('Error throw returned if updating fails', async () => {
    // Given
    const newIngredients = [
      {
        recipe_ingredient_id: 1,
        ingredient_id: 1,
        recipe_id: 1,
        name: 'Flour',
      },
      {
        recipe_ingredient_id: 2,
        ingredient_id: 2,
        recipe_id: 1,
        name: 'Eggs',
      }
    ];
    updateRecipeIngredient.mockImplementation(() => 
    Promise.reject(new Error("Failed to update recipe ingredient")));

    // When
    const result = await updateRecipeIngredients(1, newIngredients);

    // Then
    expect(result.error.message).toEqual("Failed to update recipe ingredient");
  });

  test ('Error throw returned if creation fails', async () => {
    // Given
    getRecipeIngredients.mockReturnValue(Promise.resolve([]));
    const newIngredients = [
      {
        recipe_ingredient_id: null,
        ingredient_id: 4,
        recipe_id: 2,
        name: 'Milk',
      },
    ];
    createRecipeIngredient.mockImplementation(() => 
    Promise.reject(new Error("Failed to create recipe ingredient")));

    // When
    const result = await updateRecipeIngredients(1, newIngredients);

    // Then
    expect(result.error.message).toEqual("Failed to create recipe ingredient");
  });
});