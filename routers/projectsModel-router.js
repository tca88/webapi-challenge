const express = require("express");

const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The projects information could not be retrieved."
    });
  }
});

// get specific actions for a project by its id.

router.get("/project/:id", async (req, res) => {
  try {
    const project = await Projects.getProjectActions(req.params.id);

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({
        message: "The actions with the specified Project ID does not exist."
      });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The action information could not be retrieved for the Project ID."
    });
  }
});

// get specific project information by its id.

router.get("/:id", async (req, res) => {
  try {
    const project = await Projects.get(req.params.id);

    if (project) {
      res.status(200).json(project);
    } else {
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The project information could not be retrieved."
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = req.body;
    console.log("New Project", req.body);
    if (
      project.description === undefined ||
      project.description === "" ||
      project.name === undefined ||
      project.name === "" ||
      project.completed === undefined ||
      project.completed === ""
    ) {
      res.status(400).json({
        message: "Please provide the necessary information for the project."
      });
    } else {
      const { id } = await Projects.insert(project);
      const addedProject = await Projects.get(id);
      res.status(201).json(addedProject);
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the project to the database"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, name, completed } = req.body;
    // console.log("Updated User", req.body);
    const project = await Projects.get(id);

    if (!project) {
      res.status(404).json({
        message: "The project does not exist."
      });
    }
    console.log(1);
    if (
      description === undefined ||
      description === "" ||
      name === undefined ||
      name === "" ||
      completed === undefined ||
      completed === ""
    ) {
      res.status(400).json({
        message: "Please provide the necessary information for the project"
      });
    }
    console.log(2);
    const updateResult = await Projects.update(id, req.body);
    console.log(3);
    if (updateResult) {
      const project = await Projects.get(id);
      res.status(200).json(project);
    }
    console.log(4);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The user information could not be modified." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Projects.remove(req.params.id);
    if (project) {
      res.status(200).json({ message: "The project has been deleted" });
    } else {
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The project could not be removed"
    });
  }
});

module.exports = router;
