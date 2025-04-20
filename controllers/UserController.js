const User = require('../models/User')
const Palette = require('../models/Palette')

class UserController {

    async show(req, res) {
        try {
            const id = req.session.user;
            const user = await User.findById(id);
            if (!req.session.user) {
                res.status(302).redirect('login');
            }
            res.status(200).render('settings', { message: "", page: 'settings', user: user, showSettings: req.session.user != undefined});
        } catch (error) {
            res.status(409).render('settings', { message: "Account already exists!", page: 'settings', showSettings: req.session.user != undefined})
        }
    }

    async create(req, res) {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).render('signup', { message: 'Username already exists',  page: 'login', showSettings: req.session.user != undefined });
            }
            const user = await User.create(req.body);
            res.status(201).render('login', { message: "Account created! Please login.", page: 'login', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(409).render('signup', { message: "Password must be at least 8 characters long, contain a number and an uppercase letter.", page: 'login', showSettings: req.session.user != undefined });
        }
    }

    async update(req, res) {
        try {
            const id = req.session.user;
            const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true });
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }

            const updatedUser = await User.findById(id);
            res.status(201).render('settings', { message: "", page: 'settings', user: updatedUser, showSettings: req.session.user != undefined })
        } catch (error) {
            const user = await User.findById(req.session.user)
            res.status(409).render('settings', { message: "Password must be at least 8 characters long, contain a number and an uppercase letter.", page: "settings", user: user, showSettings: req.session.user != undefined})
        }
    }

    async delete(req, res) {
        try {
            const id = req.session.user;
            await Palette.deleteMany({ userID: id });
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
    
            req.session.destroy(function(){
                res.status(303).redirect('/login')
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = UserController;