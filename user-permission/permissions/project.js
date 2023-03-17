import {ROLE} from "../data.js";

export function canViewProject(user, project) {
  return user.role === ROLE.ADMIN || user.id == project.userId;
}

export function scopedProject(user, proejcts) {
  if (user.role === ROLE.ADMIN) {
    return proejcts;
  }
  return proejcts.filter((p) => p.userId === user.id);
}

export const canDeleteProject = (user, project) => {
  return user.id === project.userId;
};
