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
    expect(deleteRecipeStep.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(1);
    expect(createRecipeStep.mock.calls.length).toEqual(1);
  });

  test('Step numbers are made sequential on save', async () => {
    // given

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

    // when

    const result = await updateRecipeSteps(1, newSteps);

    // then

    expect(result.currentSteps.map((step) => step.step_number)).toEqual([1, 2]);
  });

  test('Step numbers are made renumbered from 1 on save', async () => {
    // given

    const newSteps = [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step one',
      },
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 3,
        step_text: 'new step two',
      },
    ];

    // when

    const result = await updateRecipeSteps(1, newSteps);

    // then

    expect(result.currentSteps.map((step) => step.step_number)).toEqual([1, 2]);
  });

  test('Error returned if deletion fails', async () => {
    // Given
    const newSteps = [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step one',
      },
    ];
    deleteRecipeStep.mockImplementation(() =>
      Promise.reject(new Error('Failed to delete recipe step'))
    );
    // When
    const result = await updateRecipeSteps(1, newSteps);
    // Then
    expect(result.error.message).toEqual('Failed to delete recipe step');
  });

  test('Error returned if update fails', async () => {
    // Given
    const newSteps = [
      {
        recipe_step_id: 11,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step one',
      },
      {
        recipe_step_id: 12,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step two',
      },
    ];
    updateRecipeStep.mockImplementation(() =>
      Promise.reject(new Error('Failed to update recipe step'))
    );
    // When
    const result = await updateRecipeSteps(1, newSteps);
    // Then
    expect(result.error.message).toEqual('Failed to update recipe step');
  });

  test('Error returned if create fails', async () => {
    // Given
    getRecipeSteps.mockReturnValue(Promise.resolve([]));
    const newSteps = [
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 2,
        step_text: 'step one',
      },
    ];
    createRecipeStep.mockImplementation(() =>
      Promise.reject(new Error('Failed to create recipe step'))
    );
    // When
    const result = await updateRecipeSteps(1, newSteps);
    // Then
    expect(result.error.message).toEqual('Failed to create recipe step');
  });
});

/*
describe('update recipe steps collection', () => {
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
    // expect(deleteRecipeStep.mock.calls.length).toEqual(2);
  });
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
      {
        recipe_step_id: null,
        recipe_id: 1,
        step_number: 2,
        step_text: 'new step three',
      },
    ]);
    expect(result.changes).toEqual(4);
    expect(deleteRecipeStep.mock.calls.length).toEqual(1);
    expect(updateRecipeStep.mock.calls.length).toEqual(1);
    expect(createRecipeStep.mock.calls.length).toEqual(2);
  });
});

describe('update recipe steps collection', () => {
  test('The correct number of changes is returned promise', async () => {
    const promise = updateRecipeSteps(1, [
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
    promise.then((result) => result.changes.toEqual(3));
  });
}); 
*/
