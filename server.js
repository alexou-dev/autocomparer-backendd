const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de recherche et d'agrégation
app.get('/api/search', async (req, res) => {
    const { brand, model, yearMin, yearMax, province, sortBy } = req.query;

    // Exemple de structure d'annonces
    let results = [
        {
            id: '1',
            brand: brand || 'Ford',
            model: model || 'Mustang',
            year: 2003,
            price: 4500,
            km: 165000,
            city: 'Montréal',
            province: province || 'QC',
            sourceName: 'Kijiji Autos',
            sourceUrl: 'https://www.kijijiautos.ca',
            image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: '2',
            brand: brand || 'Ford',
            model: model || 'Mustang',
            year: 2005,
            price: 6800,
            km: 140000,
            city: 'Québec',
            province: province || 'QC',
            sourceName: 'AutoTrader.ca',
            sourceUrl: 'https://www.autotrader.ca',
            image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80'
        }
    ];

    // Tri dynamique par prix ou par km
    if (sortBy === 'price_asc') {
        results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
        results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'km_asc') {
        results.sort((a, b) => a.km - b.km);
    }

    res.json({ success: true, count: results.length, data: results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
