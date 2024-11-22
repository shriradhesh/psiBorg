const role_Check = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
         {
        return res.status(400).json({
            success : false ,
             message: 'Access Denied' });
    }
    next();
};

module.exports = role_Check;
