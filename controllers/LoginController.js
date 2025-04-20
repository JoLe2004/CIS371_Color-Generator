const User = require('../models/User')

class LoginController {

    loginPage(req, res) {
        res.render('login', { message: 'Login to Save and View Palettes', page: 'login', showSettings: req.session.user != undefined })
    }

    async requestLogin(req, res, next) {
        try {

            let returnTo = req.session.returnTo;
            const { username, password } = req.body;

            const user = await User.findOne({ username });

            if (!user) {
                return res.render('login', { message: 'User not found', page: 'login', showSettings: req.session.user != undefined });
            }

            if (password !== user.password) {
                return res.render('login', { message: 'Incorrect password', page: 'login', showSettings: req.session.user != undefined });
            }
;
            req.session.regenerate((err) => {
                if (err) return next(err);
                req.session.user = user._id;
                res.redirect(returnTo ?? '/');
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Server error');
        }
    }
    
    logout(req, res) {
        req.session.destroy(function(){
            res.redirect('/login')
        })
    }
}

module.exports = LoginController