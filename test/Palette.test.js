const Palette = require('../models/Palette')

describe('Palette', () => {

    describe('Constructor', () => {
        it('should set all Palette properties', () => {
            const palette = new Palette({ 
                name: 'Test', 
                colors: ['#00000', '#000000', '#000000', '#FFFFFF', '#FFFFFF'], 
                userID: '645c89f1c134b4d8b8f6a5d2'
            })

            expect(palette.name).toBe('Test')
            expect(palette.colors).toEqual(['#00000', '#000000', '#000000', '#FFFFFF', '#FFFFFF'])
            expect(palette.userID.toString()).toBe('645c89f1c134b4d8b8f6a5d2')
        })
    })

    describe('Validation', () => {
        it('accepts a valid palette', () => {
            const palette = new Palette({ 
                name: 'Test', 
                colors: ['#000000'] 
            })
            const error = palette.validateSync()
            expect(error).toBeUndefined()
        })

        it('accepts default name if not provided', () => {
            const palette = new Palette({ colors: ['#000000'] })
            expect(palette.name).toBe('New Palette')
        })

        it('requires colors', () => {
            const palette = new Palette({ name: 'Test' })
            const error = palette.validateSync()
            expect(error.errors.colors).toBeDefined()
        })
    })

})
