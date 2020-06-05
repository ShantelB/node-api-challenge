const express = require('express');
const router = express.Router();

const action = require('../data/helpers/actionModel')

router.get('/', (req, res) => {
    action.get()
    .then(actions => {
        res.status(200).json({actions: actions})
    })
})

router.get('/:id', validateProjectId, (req, res) => {
    action.get(req.params.id)
      .then(actions => {
          if(actions.length){
          res.status(404).json({error: "The project with the specified ID does not exist."})
      } else {
          res.status(200).json({actions: actions})
      }
      })
      .catch(error => {
          res.status(404).json({message: "The project with the specified ID does not exist." })
      })
  });

  router.post('/', validateProject, (req, res) => {
    action.insert(req.body)
    .then(actions => {
         res.status(201).json(actions)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the project to the database"})
    })
});

router.put('/:id', validateProject, validateProjectId, (req, res) => {
    const update = {
        notes:req.body.notes,
        description: req.body.description
    }
    action.update(req.params.id, update)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({ message: "error could not update user on server" })
    })
  });

  router.delete('/:id', validateProjectId, (req, res) => {
    action.remove(req.params.id)
    .then(actions =>{
        if(actions){ res.status(200).json(actions)
        } else {res.status(404).json({message: "The project with the specified ID does not exist." })}
    })
    .catch(error => {
        res.status(500).json({ error: "The project information could not be retrieved." })
    })
  })

  //Middleware

  function validateProjectId(req, res, next) {
    const { id } = req.params
    
    action.get(id)
    .then(post => {
      req.post = post
      next()
    })
    .catch(error => {
      res.status(400).json({ message: "invalid id" })
    })
    
    }
  
    function validateProject(req, res, next) {
      if(!req.body){
        res.status(400).json({errorMessage: "error getting body!."})
    } else if(!req.body){
        res.status(400).json({errorMessage: "Please provide description/notes for the action."})
    } else {
      next()
    }
    }  
 
module.exports = router