const requireAdmin = (req, res, next) => {
  const role = req.body.role || req.query.role;
  if (!role || role.toLowerCase() !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
};

const requireCoordinator = (req, res, next) => {
  const role = req.body.role || req.query.role;
  if (!role || role.toLowerCase() !== 'student') {
    return res.status(403).json({ message: 'Coordinator role required' });
  }
  next();
};

export { requireAdmin, requireCoordinator };
