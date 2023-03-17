import express from "express";

import { projects } from "../data.js";
const router = express.Router();
import { authUser } from "../basicAuth.js";
import {
  canViewProject,
  scopedProject,
  canDeleteProject,
} from "../permissions/project.js";

router.get("/", authUser, (req, res) => {
  res.json(scopedProject(req.user, projects));
});

router.get(
  "/:projectId",
  populateProject,
  authUser,
  authGetProject,
  (req, res) => {}
);

router.delete(
  "/:projectId",
  authUser,
  populateProject,
  authDeleteProject,
  (req, res) => {
    res.status(200).json("Delete Project");
  }
);

function populateProject(req, res, next) {
  const projectId = req.params.projectId;
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    req.project = project;
    return next();
  }
  res.status(404).send("Project not found");
}

function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(403).send("Access denied");
  }
  next();
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
    res.status(403).send("Access denied");
  }
  next();
}
export default router;