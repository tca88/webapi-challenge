const express = require("express");

const Actions = require("../data/helpers/actionModel.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The actions information could not be retrieved."
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const action = await Actions.get(req.params.id);

    if (action) {
      res.status(200).json(action);
    } else {
      res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The action information could not be retrieved."
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const action = req.body;
    console.log("New Action", req.body);
    if (
      action.description === undefined ||
      action.description === "" ||
      action.notes === undefined ||
      action.notes === "" ||
      action.completed === undefined ||
      action.completed === "" ||
      action.project_id === undefined ||
      action.project_id === ""
    ) {
      res.status(400).json({
        message:
          "Please provide all of the required information for the action."
      });
    } else {
      const { id } = await Actions.insert(action);
      const addedAction = await Actions.get(id);
      res.status(201).json(addedAction);
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the action to the database"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { project_id, description, notes, completed } = req.body;
    // console.log("Updated Action", req.body);
    const action = await Actions.get(id);

    if (!action) {
      res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }
    // console.log(1);
    if (
      description === undefined ||
      description === "" ||
      notes === undefined ||
      notes === "" ||
      completed === undefined ||
      completed === "" ||
      project_id === undefined ||
      project_id === ""
    ) {
      res.status(400).json({
        message: "Please provide the necessary information for the action."
      });
    }
    // console.log(2);
    const updateResult = await Actions.update(id, req.body);
    // console.log(3);
    if (updateResult) {
      const action = await Actions.get(id);
      res.status(200).json(action);
    }
    // console.log(4);
  } catch (err) {
    res.status(500).json({ error: "The action could not be modified." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const action = await Actions.remove(req.params.id);
    if (action) {
      res.status(200).json({ message: "The action has been deleted" });
    } else {
      res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The action could not be removed"
    });
  }
});

module.exports = router;
