var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.get('/', function (req, res) {
    res.send('Todo API root');
});

app.use(bodyParser.json());

/* Get individual todo */
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
        if (!_.isNull(todo)) {
            res.json(todo);
        } else {
            res.status(404).json({
                "error": 'No todo found with that id.'
            });
        }

    }).catch(function (err) {
        res.status(500).json(err);
    });
});

/* Get all todos */
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            "$like": '%' + query.q + '%'
        };
    }

    db.todo.findAll({
        "where": where
    }).then(function (todos) {
        res.json(todos);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

/* POST Create new todo*/
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }).catch(function (err) {
        res.status(400).json(err);
    });
});


/* Delete a todo */
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    } else {
        return res.status(404).json({
            "error": "No todo found with that id."
        });
    }
});

/* PUT */
app.put('/todos/:id', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        return res.status(404).json({
            "error": "No matching todo found."
        });
    }

    /* Validate the completed status */
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).json({
            "error": "Completed not proper"
        });
    } else {
        // Attribute never provided, no problem
    }

    /* Validate the description */
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).json({
            "error": "Description not proper"
        });
    } else {
        // Attribute never prodivded, no problem
    }

    /* Attributes at this point are valid and the todo can be updated,
       because 'matched todo' is an object it is passed by reference &
       this call to _.extend(...) is enough to update the object in 'todo' */
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

// Sync the database
db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT);
    });
});