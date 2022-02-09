const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;

  const user = users.find(user => user.username === username);
  
  if(!user){
    return response.status(404).json({error: "usuario invalido, crie um usuario antes"});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const customersAlreadyExists = users.some(
    (user) => user.username === username
  );

  if(customersAlreadyExists){
    return response.status(400).json({error: "usuario já cadastrado"})
  }
  const user ={
    id: uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(user)

  return response.status(201).json(user);    
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;

  const{user} = request;

  const fazerTarefa ={
    id:uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
    username: user.username
  }

  user.todos.push(fazerTarefa);

  return response.status(201).json(fazerTarefa);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {title, deadline} = request.body;
  const{user} = request;

  const todo = user.todos.find(todo => todo.id === id);
  if(!todo){
    return response.status(404).json({error: 'todo não encontrado'})
  }
  todo.title = title;
  todo.deadline = new Date(deadline);


  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const{user} = request;

  const todo = user.todos.find(todo => todo.id === id);
  if(!todo){
    return response.status(404).json({error: 'todo não encontrado'})
  }
  todo.done = true;

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const{user} = request;

  const { todos } = user;

  console.log(todos);
  const index = todos.findIndex(todo => todo.id === id);

  console.log(index, id)
  if(index === -1){
    return response.status(404).json({error: 'todo não encontrado'})
  }

  user.todos.splice(index, 1);

  return response.status(204).send();
});

module.exports = app;