const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Serveur AutoComparer actif !</h1>');
});

app.get('/api/search', (req, res) => {
    const { brand = 'Ford', model = 'Mustang', province = 'QC', sortBy = 'price_asc' } = req.query;

    const b = brand.trim() || 'Ford';
    const m = model.trim() || 'Mustang';

    // Génération de liens de recherche dynamiques
    const sources = [
        { name: 'AutoTrader.ca', url: `https://www.autotrader.ca/cars/${encodeURIComponent(b.toLowerCase())}/${encodeURIComponent(m.toLowerCase())}/` },
        { name: 'Kijiji Autos', url: `https://www.kijijiautos.ca/cars/${encodeURIComponent(b.toLowerCase())}/${encodeURIComponent(m.toLowerCase())}/` },
        { name: 'Otogo.ca', url: `https://www.otogo.ca/recherche?make=${encodeURIComponent(b)}&model=${encodeURIComponent(m)}` },
        { name: 'LesPAC', url: `https://www.lespac.com/recherche?kw=${encodeURIComponent(b + ' ' + m)}` }
    ];

    const basePrices = [4200, 5800, 7500, 9200, 11500, 14800, 18500, 22000, 26500, 31000];
    const years = [2003, 2005, 2008, 2011, 2014, 2016, 2018, 2020, 2022, 2024];
    const cities = ['Montréal', 'Québec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Trois-Rivières'];

    let results = basePrices.map((price, idx) => {
        const sourceObj = sources[idx % sources.length];
        return {
            id: String(idx + 1),
            brand: b,
            model: m,
            year: years[idx],
            price: price,
            km: 180000 - (idx * 14000),
            city: cities[idx % cities.length],
            province: province,
            sourceName: sourceObj.name,
            sourceUrl: sourceObj.url,
            image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80'
        };
    });

    // Tri dynamique
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
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
