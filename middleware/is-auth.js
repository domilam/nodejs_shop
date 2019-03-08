module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated){
        let isHide = false;
        return res.redirect('/?isHide='+isHide);
    }
    next();
}