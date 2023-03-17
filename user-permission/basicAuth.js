export function authUser(req, res, next) {
  if (req.user === null) {
    res.status(403).send("Please login first.");
  }
}
export function authRole(role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      res.status(401).send("not allowed.");
    }
  };
}
