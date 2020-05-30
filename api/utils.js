function requireUser(req, res, next) {

    console.log('entered requireUser');
    if(!req.user) {
        next({
            name: "MissingUserError",
            message: "You must be logged in dummy"
        });
    }
    console.log('exiting requireUser');
    next();
}

module.exports = {
    requireUser
}