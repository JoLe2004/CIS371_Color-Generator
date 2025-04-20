const PaletteController = require('../controllers/PaletteController');
const Palette = require('../models/Palette');
const User = require('../models/User');

jest.mock('../models/Palette');
jest.mock('../models/User');

let controller;
let req;
let res;
let mockPalette;

beforeEach(() => {
    jest.clearAllMocks();

    controller = new PaletteController();

    mockPalette = {
        _id: '123abc',
        name: 'Test Palette',
        colors: ['#000000', '#FFFFFF'],
        userID: 'user123',
        save: jest.fn()
    };

    req = {
        session: { user: 'user123' },
        body: { name: 'Test Palette', colors: JSON.stringify(['#000000', '#FFFFFF']) },
        params: { id: '123abc' }
    };

    res = {
        render: jest.fn(),
        send: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
    };
});

describe('#index', () => {
    it('renders palette index with user palettes', async () => {
        Palette.find.mockResolvedValue([mockPalette]);
        await controller.index(req, res);
        expect(res.render).toHaveBeenCalledWith('paletteIndex', {
            palettes: [mockPalette],
            page: 'palettes',
            showSettings: true
        });
    });
});

describe('#show', () => {
    it('renders paletteEdit view with correct palette', async () => {
        Palette.findById.mockResolvedValue(mockPalette);
        await controller.show(req, res);
        expect(res.render).toHaveBeenCalledWith('paletteEdit', {
            palette: mockPalette,
            page: 'palettes',
            showSettings: true
        });
    });
});

describe('#create', () => {
    it('creates a new palette and renders index', async () => {
        Palette.mockImplementation(() => mockPalette);
        Palette.find.mockResolvedValue([mockPalette]);
        User.findByIdAndUpdate.mockResolvedValue({});
        await controller.create(req, res);
        expect(mockPalette.save).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('paletteIndex', {
            palettes: [mockPalette],
            page: 'palettes',
            showSettings: true
        });
    });
});

describe('#update', () => {
    it('updates a palette and renders index', async () => {
        Palette.findByIdAndUpdate.mockResolvedValue(mockPalette);
        Palette.find.mockResolvedValue([mockPalette]);
        await controller.update(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.render).toHaveBeenCalledWith('paletteIndex', {
            palettes: [mockPalette],
            page: 'palettes',
            showSettings: true
        });
    });
});

describe('#delete', () => {
    it('deletes a palette and renders index', async () => {
        Palette.findByIdAndDelete.mockResolvedValue(mockPalette);
        Palette.find.mockResolvedValue([]);
        User.findOneAndUpdate.mockResolvedValue({});
        await controller.delete(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.render).toHaveBeenCalledWith('paletteIndex', {
            palettes: [],
            page: 'palettes',
            showSettings: true
        });
    });
});
