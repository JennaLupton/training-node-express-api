jest.mock('../connectors/recipe-step.connector.js');
const {
  getRecipeSteps,
  deleteRecipeStep,
  updateRecipeStep,
  createRecipeStep,
} = require('../connectors/recipe-step.connector.js');

getRecipeSteps.mockReturnValue(
  Promise.resolve([
    {
      recipe_step_id: 11,
      recipe_id: 1,
      step_number: 1,
      step_text: 'step one',
    },
    {
      recipe_step_id: 12,
      recipe_id: 1,
      step_number: 2,
      step_text: 'step two',
    },
  ])
);
deleteRecipeStep.mockReturnValue(Promise.resolve({ changes: 1 }));
updateRecipeStep.mockReturnValue(Promise.resolve({ changes: 1 }));
createRecipeStep.mockReturnValue(Promise.resolve({ changes: 1 }));
const { updateRecipeSteps } = require('./recipe-step.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('update recipe steps collection', () => {
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeSteps(1, [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 1,
        step_text: 'step one',
      },
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 2,
        step_text: 'new step two',
      },
    ]);
    expect(result.changes).toEqual(3);
    expect(getRecipeSteps.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(1);
    expect(deleteRecipeStep.mock.calls.length).toEqual(1);
    expect(createRecipeStep.mock.calls.length).toEqual(1);
  });
});

describe('update both recipe steps collection', () => {
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeSteps(1, [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 1,
        step_text: 'step one',
      },
      {
        recipe_step_id: 12,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step two',
      },
    ]);
    expect(result.changes).toEqual(2);
    expect(getRecipeSteps.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(2);
    expect(deleteRecipeStep.mock.calls.length).toEqual(0);
    expect(createRecipeStep.mock.calls.length).toEqual(0);
  });
});

describe('delete both recipe steps collection', () => {
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeSteps(1, [
      {
        recipe_step_id: null,
        recipe_id: null,
        step_number: null,
        step_text: null,
      },
      {
        recipe_step_id: null,
        recipe_id: null,
        step_number: null,
        step_text: null,
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(getRecipeSteps.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(0);
    expect(deleteRecipeStep.mock.calls.length).toEqual(2);
    expect(createRecipeStep.mock.calls.length).toEqual(2);
  });
});

describe('create both recipe steps collection', () => {
  test('The correct number of changes is returned', async () => {
    const result = await updateRecipeSteps(1, [
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 1,
        step_text: 'new step one',
      },
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 2,
        step_text: 'new step two',
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(getRecipeSteps.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(0);
    expect(deleteRecipeStep.mock.calls.length).toEqual(2);
    expect(createRecipeStep.mock.calls.length).toEqual(2);
  });

  test('Step numbers are made sequential on save', async () => {
    // Given
      const newSteps = [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 1,
        step_text: 'step one',
      },
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 3,
        step_text: 'new step two',
      },
    ];

    // When
    const result = await updateRecipeSteps(1, newSteps);

    // Then
    expect(result.currentSteps.map((step) => step.step_number)).toEqual([1,2]);

  })
});