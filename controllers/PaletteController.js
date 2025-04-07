const Palette = require('../models/Palette')
const User = require('../models/User')

class PaletteController {

    async generate(req, res) {
        try {
            res.render('index', { page: 'home', showSettings: req.session.user != undefined })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async index(req, res) {
        try {
            const palettes = await Palette.find({ userID: req.session.user });
            res.render('paletteIndex', { palettes: palettes, page: 'palettes', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async show(req, res) {
        try {
            const id = req.params.id;
            const palette = await Palette.findById(id);
            res.render('paletteEdit', { palette: palette, page: 'palettes', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async create(req, res) {
        try {
            console.log("creating palette")
            const colors = JSON.parse(req.body.colors);
            const palette = new Palette({
                name: req.body.name || "New Palette",
                colors: colors,
                userID: req.session.user
            });
    
            await palette.save();
            await User.findByIdAndUpdate(req.session.user, { $push: { palettes: palette._id } });
            const palettes = await Palette.find({ userID: req.session.user });
            res.render('paletteIndex', { palettes: palettes, page: 'palettes', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const colors = JSON.parse(req.body.colors);
            const name = req.body.name;
            const palette = await Palette.findByIdAndUpdate(id, { $set: { name: name, colors: colors } });
            if (!palette) {
                return res.status(404).json({message: "Palette not found"});
            }
            const palettes = await Palette.find({ userID: req.session.user });
            res.status(201).render('paletteIndex', { palettes: palettes, page: 'palettes', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            await User.findOneAndUpdate({_id: req.session.user}, {$pull: {palettes: id}})
            const palette = await Palette.findByIdAndDelete(id)
            if (!palette) {
                return res.status(404).json({ message: "Palette not found" })
            }
            
            const palettes = await Palette.find({ userID: req.session.user });
            res.status(201).render('paletteIndex', { palettes: palettes, page: 'palettes', showSettings: req.session.user != undefined });
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = PaletteController;