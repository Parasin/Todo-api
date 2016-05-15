var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1
    , desc: 'Meet Morgan'
    , completed: false
}, {
    id: 2
    , desc: 'Practice coding'
    , completed: false
}, {
    id: 3
    , desc: 'Watch T.V.'
    , completed: true
}];

app.get('/', function (req, res) {
   res.send('Todo API root'); 
});

/* Get individual todo */
app.get('/todos/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    todos.forEach(function (todo) {
        if (todo.id === id) {
            
            res.json(todo);        
        }
        else {
            // Do nothing
        }
    });
    res.status(404).send();
});

/* Get all todos */
app.get('/todos', function (req, res) {
    res.json(todos);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT);
});
