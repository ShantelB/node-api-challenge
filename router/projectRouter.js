const express = require('express');
const router = express.Router();

const project = require('../data/helpers/projectModel')

router.get('/', (req, res) => {
    project.get()
  .then(projects =>{
      res.status(200).json({projects: projects})
  })
  .catch(error => {
      res.status(500).json({ error: "The posts information could not be retrieved."  })
  });
})

router.get('/:id', validateProjectId, (req, res) => {
    project.get(req.params.id)
      .then(projects => {
          if(projects.length){
          res.status(404).json({error: "The project with the specified ID does not exist."})
      } else {
          res.status(200).json({projects: projects})
      }
      })
      .catch(error => {
          res.status(404).json({message: "The project with the specified ID does not exist." })
      })
  });

  router.get("/:id/actions", validateProjectId, (req, res) => {
    project.getProjectActions(req.params.id)
      .then(actions => {
        if (actions) {
          res.status(200).json(actions);
        } else {
          res.status(404).json({ message: "No actions found" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error retrieving actions" });
      });
  });

  router.post('/', validateProject, (req, res) => {
             project.insert(req.body)
             .then(post => {
                  res.status(201).json(post)
             })
             .catch(error => {
                 res.status(500).json({ error: "There was an error while saving the project to the database"})
             })
  });

  router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const update = {
        name:req.body.name,
        description: req.body.description
    }

    project.update(req.params.id, update)
    .then(count => {
      res.status(200).json(count)
    })
    .catch(err => {
      res.status(500).json({ message: "error could not update user on server" })
    })
  });

  router.delete('/:id', validateProjectId, (req, res) => {
    project.remove(req.params.id)
    .then(projects =>{
        if(projects){ res.status(200).json(projects)
        } else {res.status(404).json({message: "The project with the specified ID does not exist." })}
    })
    .catch(error => {
        res.status(500).json({ error: "The project information could not be retrieved." })
    })
  })

  //Middleware

  function validateProjectId(req, res, next) {
  const { id } = req.params
  
  project.get(id)
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
      res.status(400).json({errorMessage: "Please provide text/name for the project."})
  } else {
    next()
  }
  }
 
module.exports = router
