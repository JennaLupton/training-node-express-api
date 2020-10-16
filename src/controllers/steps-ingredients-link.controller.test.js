jest.mock('../connectors/steps-ingredients-link.connector.js');
const {
    getStepIngredients,
    deleteStepIngredient,
    createStepIngredient,
} = require('../connectors/steps-ingredients-link.connector.js');

getStepIngredients.mockReturnValue(
    Promise.resolve([
        {
            recipe_step_id: 1,
            recipe_ingredient_id: 1,
        },
        {
            recipe_step_id: 2,
            recipe_ingredient_id: 2,
        },
    ])
);
deleteStepIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
createStepIngredient.mockReturnValue(Promise.resolve({ changes: 1 }));
const { updateStepIngredients } = require('./steps-ingredients-link.controller');

afterEach(() => {
    jest.clearAllMocks();
});

describe('Update step ingredients collection', () => {
    // Test for not updating the step ingredients
    test('The correct number of changes is returned', async () => {
        const result = await updateStepIngredients(1, [
            {
                recipe_step_id: 1,
                recipe_ingredient_id: 1,
            },
            {
                recipe_step_id: 2,
                recipe_ingredient_id: 2,
            },
        ]);
        expect(result.changes).toEqual(0);
        expect(getStepIngredients.mock.calls.length).toEqual(1);
        expect(deleteStepIngredient.mock.calls.length).toEqual(0);
        expect(createStepIngredient.mock.calls.length).toEqual(0);
    });

    // Test for deleting one step ingredient
    test('The correct number of changes is returned', async () => {
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

    // Test for deleting both step ingredients
    test('The correct number of changes is returned', async () => {
        const result = await updateStepIngredients(1, []);
        expect(result.changes).toEqual(2);
        expect(getStepIngredients.mock.calls.length).toEqual(1);
        expect(deleteStepIngredient.mock.calls.length).toEqual(2);
        expect(createStepIngredient.mock.calls.length).toEqual(0);
    });

    // Test for creating a new step ingredient
    test('The correct number of changes is returned', async () => {
        const result = await updateStepIngredients(1, [
            {
                recipe_step_id: 1,
                recipe_ingredient_id: 1,
            },
            {
                recipe_step_id: 2,
                recipe_ingredient_id: 2,
            },
            {
                recipe_step_id: 3,
                recipe_ingredient_id: 3,
            }
        ]);
        expect(result.changes).toEqual(1);
        expect(getStepIngredients.mock.calls.length).toEqual(1);
        expect(deleteStepIngredient.mock.calls.length).toEqual(0);
        expect(createStepIngredient.mock.calls.length).toEqual(1);
    });
});