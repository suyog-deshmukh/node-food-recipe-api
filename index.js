const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const port = 3000
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
connection.connect()




app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/foodRecipe/:foodRecipe', (req, res) => {
    console.log(req.params.foodRecipe);
    var sql = `SELECT * FROM Food INNER JOIN Ingredient ON Food.Id = Ingredient.FoodId Where FoodName Like '%${req.params.foodRecipe}%' `;
    let uniqueFood = [];
    connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        const foodArray = [];

        const foodObject = {
            foodName: '',
            videoLink: '',
            foodImageUrl: '',
            Ingredient: []
        }
        let foName = [];
        let uniqueArrayIndex = [];
        result.forEach((food, i) => {
            if (!foName.includes(food.FoodName)) {
                foName.push(food.FoodName)
                uniqueArrayIndex.push(i);
            }
            let foodName = food.FoodName;
            foodObject.foodName = food.FoodName;
            foodObject.videoLink = food.VideoLink;
            foodObject.foodImageUrl = food.FoodImageUrl;
            const fooArray = [];
            result.forEach(arr => {
                if (foodName == arr.FoodName) {
                    fooArray.push(arr.Name)
                }
            })

            foodArray.push({
                foodName: food.FoodName,
                videoLink: food.VideoLink,
                foodImageUrl: food.FoodImageUrl,
                Ingredient: fooArray
            })
        });
        uniqueArrayIndex.forEach(index => {
            uniqueFood.push(foodArray[index]);
        })
        res.json(uniqueFood)
        console.log(uniqueFood)

    })
})

app.get('/foodCategory/:foodCategory', (req, res) => {
    var sql = `SELECT * FROM Category INNER JOIN Food ON Category.Id = Food.CategoryId Where Name = '${req.params.foodCategory}'  `;
    let uniqueFood = [];
    connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        const foodArray = [];
        let foName = [];
        let uniqueArrayIndex = [];
        result.forEach((food, i) => {
            if (!foName.includes(food.FoodName)) {
                foName.push(food.FoodName)
                uniqueArrayIndex.push(i);
            }
            let foodName = food.FoodName;

            foodArray.push({
                foodName: food.FoodName,
                videoLink: food.VideoLink,
                foodImageUrl: food.FoodImageUrl
            })
        });
        uniqueArrayIndex.forEach(index => {
            uniqueFood.push(foodArray[index]);
        })
        res.json(uniqueFood)
        console.log(uniqueFood)

    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})