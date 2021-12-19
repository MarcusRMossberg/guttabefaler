const tasksRouter = require("express").Router();
const task = require("../models/task");
const Task = require("../models/task");
const User = require("../models/user");
const upload = require("../services/ImageUpload");
const singleUpload = upload.single("image");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

tasksRouter.get("/", async (request, response) => {
  const tasks = await Task.find({}).populate("user", { username: 1, name: 1 });
  response.json(tasks.map((task) => task.toJSON()));
});

tasksRouter.get("/:id", async (request, response) => {
  const task = await Task.findById(request.params.id);
  if (task) {
    response.json(task);
  } else {
    response.status(404).end();
  }
});

tasksRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const creator = await User.findById(decodedToken.id);
  const user = await User.findById(body.user);
  const task = new Task({
    title: body.title,
    info: body.info,
    points: body.points || 1,
    image: body.image,
    user: body.user,
    createdBy: creator,
    completed: body.completed || false,
  });

  const savedTask = await task.save();
  user.tasks = user.tasks.concat(savedTask._id);
  await user.save();

  response.status(201).json(savedTask);
});

tasksRouter.delete("/:id", async (request, response) => {
  await Task.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

tasksRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const task = await Task.findById(request.params.id);
  const user = await User.findById(decodedToken.id);

  taskUpdate = {
    title: body.title || task.title,
    info: body.info || task.info,
    points: body.points || task.points,
    user: user._id || task.user,
    image: body.image || task.image,
    completed: body.completed || task.completed || false,
  };

  const savedTask = await Task.findByIdAndUpdate(
    request.params.id,
    taskUpdate,
    { new: true }
  );

  response.json(savedTask);
});

module.exports = tasksRouter;
