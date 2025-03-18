const Palette = require('../models/Palette')

class PaletteController {

    async generate(req, res) {
        try {
            const response = await fetch("http://colormind.io/api/",
                {method: "POST", 
                 headers: {"Content-Type": "application/json"},
                 body: JSON.stringify({model: "default", input: ["N", "N", "N", "N", "N"]})
                })
            
            const result = await response.json()
            res.render('index', { result: result["result"] })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async index(req, res) {
        try {
            const palettes = await Palette.find({});
            res.render('index', { palettes: palettes })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const palette = await Palette.findById(id);
            res.status(200).json(palette)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async create(req, res) {
        try {
            const palette = await Palette.create(req.body);
            res.status(200).json(palette);
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async edit(req, res) {
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const palette = await Palette.findByIdAndUpdate(id, req.body);
            if (!palette) {
                return res.status(404).json({message: "Palette not found"})
            }
    
            updatedPalette = await Palette.findById(id);
            res.status(200).json(palette)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const palette = await Palette.findByIdAndDelete(id);
            if (!palette) {
                return res.status(404).json({ message: "Palette not found" })
            }
    
            res.status(200).json({message: "Palette deleted successfully"})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = PaletteController;