

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  // console.log(req. , "aman")
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    
      return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};



// const authorizeRoles = (roles) => (req, res, next) => {
//   console.log("It is role",roles)
//   console.log(req.role);
//   // console.log("User role:", req.user?.role);  

//   if (!req.role || !roles.includes(req.role)) {
//     return res.status(403).json({ error: 'Sorry, you do not have access to this route' });
      
//   }
//   next();
// };

module.exports = authorizeRoles;






