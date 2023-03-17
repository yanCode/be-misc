export function authUser(req, res, next) {
  if (req.user == null) {
    return res.status(403).send("Please login first.");
  }
  next();
}
export function authRole(role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res.status(401).send("not allowed.");
    }
    next();
  };
}
