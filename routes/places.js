const express = require('express');
const geo = require('node-geocoder');
const router = express.Router();

const geocoder = geo({
    provider: 'openstreetmap',
    headers: { 'user-agent': 'My application <email@domain.com>' }
});

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    const result = await geocoder.geocode(req.body.address);
    let lat = 0, lng = 0, address = req.body.address;

    if (result.length > 0) {
        lat = result[0].latitude;
        lng = result[0].longitude;
        address = result[0].formattedAddress;
    }

    const id = await req.db.createPlace(req.body.label, address, lat, lng);
    res.json({ id: id, label: req.body.label, address: address, lat: lat, lng: lng });
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
});

module.exports = router;
