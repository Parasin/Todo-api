var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite'
    , 'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    "description": {
        "type": Sequelize.STRING
        , "allowNull": false
        , "validate": {
            "len": [1, 250]
        }
    }
    , "completed": {
        "type": Sequelize.BOOLEAN
        , "allowNull": false
        , "defaultValue": false
    }
});

sequelize.sync({
    //"force": true
}).then(function () {
    console.log('Everything is synced');

    Todo.findById(3).then(function (todo) {
        if (todo) {
            console.log('Todo found: ' + todo.description);
        } else {
            console.log('No todo found with that id');
        }
    }).catch (function (err){
        console.log(err);
    });
    
    /*Todo.create({
        "description": "walk my dog"
        , "completed": false
    }).then(function (todo) {
        console.log('Finished:' + JSON.stringify(todo));
        return Todo.create({
             "description": "Practice coding"
        });
    }).then(function (todo) {
        //return Todo.findById(1);
        return Todo.findAll({
            "where": {
                "description" : {
                    $like : "%coding%"
                }
            }
        });
    }).then(function (todos) {
        if (todos) {
            todos.forEach(function (todo) {
                console.log(todo.toJSON());    
            });
            
        } else {
            console.log ('No todo found with that id.');
        }
        
    }).catch(function (err) {
        console.log(err);
    });*/
});