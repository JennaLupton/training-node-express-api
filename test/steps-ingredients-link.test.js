/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const request = require('supertest');
const winston = require('winston');
const { app } = require('../src/app');
const { Connection } = require('../src/connectors/connection');

const resetDb = async () => {
    await Connection.run('DELETE FROM steps_ingredients_link', []);
    await Connection.run('DELETE FROM recipe_ingredients', []);
    await Connection.run('DELETE FROM recipe_steps', []);
    await Connection.run('DELETE FROM recipes', []);
    const sqlInsertRecipes = `INSERT INTO recipes (title, short_description, preparation_time) VALUES
        ('Banoffee Pie', 'An English dessert pie made from bananas, cream and caramel.', 25),
        ('Pizza Margherita', 'Pizza Margherita is a typical Neapolitan pizza, made with tomatoes, mozzarella cheese, fresh basil and olive oil.', 30);`;
    await Connection.run(sqlInsertRecipes, []);
    const sqlInsertRecipeSteps = `INSERT INTO recipe_steps (recipe_id, step_number, step_text) VALUES
        (1, 1, 'Crush biscuits.'),
        (1, 2, 'Boil milk.'),
        (2, 1, 'Argue over whether to add pineapple.');`;
    await Connection.run(sqlInsertRecipeSteps, []);
    const sqlInsertRecipeIngredients = `INSERT INTO recipe_ingredients (ingredient_id, recipe_id, name) VALUES
        (1, 1, 'Flour'),
        (2, 1, 'Eggs'),
        (3, 2, 'Sugar');`;
    await Connection.run(sqlInsertRecipeIngredients, []);
    const sqlInsertStepIngredients = `INSERT INTO steps_ingredients_link (recipe_step_id, recipe_ingredient_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3);`;
    await Connection.run(sqlInsertStepIngredients, []);
};

describe('HTTP requests to /steps-ingredients-link', () => {
    beforeAll(async () => {
        winston.level = 'warning';
        await Connection.connect();
        await Connection.resetDb();
    });

    beforeEach(async () => {
        await resetDb();
    });

    test('A valid step ingredient can be saved and then retrieved', async () => {
        const data = {
            recipe_step_id: 2,
            recipe_ingredient_id: 1,
        };
        const postResponse = await request(app)
            .post('/recipes/1/recipe-steps/2/step-ingredients')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
        
        expect(postResponse.status).toEqual(201);
        const { lastID, changes } = postResponse.body;
        expect(lastID).toBeGreaterThan(0);
        expect(changes).toEqual(1);

        const getResponse = await request(app)
            .get(`/recipes/1/recipe-steps/2/step-ingredients/${lastID}/`)
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
        
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.recipe_ingredient_id).toEqual(1);
    });

    test('Step ingredients for a step can be retrieved and deleted', async () => {
        const getResponse = await request(app)
            .get(`/recipes/1/recipe-steps/1/step-ingredients`)
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
    
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.length).toEqual(3);

        const deleteResponse = await request(app)
            .delete(`/recipes/1/recipe-steps/1/step-ingredients/${getResponse.body[0].recipe_ingredient_id}`)
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(deleteResponse.status).toEqual(200);
        expect(deleteResponse.body.changes).toEqual(1);

        const getResponse2 = await request(app)
            .get('/recipes/1/recipe-steps/1/step-ingredients')
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(getResponse2.status).toEqual(200);
        expect(getResponse2.body.length).toEqual(2);
        expect(getResponse2.body[0].recipe_ingredient_id).toEqual(2);
    });

    afterAll(async () => {
        await Connection.db.close();
    });
});