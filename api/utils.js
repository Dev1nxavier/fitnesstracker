function requireUser(req, res, next) {
    if(!req.user) {
        next({
            name: "MissingUserError",
            message: "You must be logged in dummy"
        });
    }

    next();
}

module.exports = {
    requireUser
}