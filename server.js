const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Serveur AutoComparer v2.0 - Actif</h1>');
});

// Endpoint principal de recherche avec filtres complets
app.get('/api/search', (req, res) => {
    const { 
        brand = 'Ford', 
        model = 'Mustang', 
        province = 'QC', 
        minPrice = 0, 
        maxPrice = 100000,
        minYear = 2000,
        maxYear = 2026,
        transmission = 'all',
        sortBy = 'price_asc' 
    } = req.query;

    const queryBrand = brand.trim() || 'Ford';
    const queryModel = model.trim() || 'Mustang';

    // Génération des URLs de recherche directes filtrées pour chaque plateforme
    const sources = [
        { 
            name: 'AutoTrader.ca', 
            url: `https://www.autotrader.ca/cars/${encodeURIComponent(queryBrand.toLowerCase())}/${encodeURIComponent(queryModel.toLowerCase())}/${province.toLowerCase()}/?prx=-1&prv=${province}&loc=QC&stl=True` 
        },
        { 
            name: 'Kijiji Autos', 
            url: `https://www.kijijiautos.ca/cars/${encodeURIComponent(queryBrand.toLowerCase())}/${encodeURIComponent(queryModel.toLowerCase())}/` 
        },
        { 
            name: 'Otogo.ca', 
            url: `https://www.otogo.ca/recherche?make=${encodeURIComponent(queryBrand)}&model=${encodeURIComponent(queryModel)}` 
        },
        { 
            name: 'LesPAC', 
            url: `https://www.lespac.com/recherche?kw=${encodeURIComponent(queryBrand + ' ' + queryModel)}` 
        },
        { 
            name: 'FB Marketplace', 
            url: `https://www.facebook.com/marketplace/category/vehicles?query=${encodeURIComponent(queryBrand + ' ' + queryModel)}` 
        }
    ];

    // Données de démonstration structurées selon la maquette AutoTrader
    const rawListings = [
        { id: '1', year: 2021, trim: 'Fastback GT 5.0L Auto | Nav | Perf Pkg', price: 48495, km: 5936, trans: 'Automatique', fuel: 'Essence', dealer: 'Two Guys Quality Cars', city: 'St. Catharines', prov: 'ON', img: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80', badge: 'Excellent prix' },
        { id: '2', year: 2020, trim: 'Fastback BULLITT | Manual | Recaro Seats', price: 49987, km: 81938, trans: 'Manuelle', fuel: 'Essence', dealer: 'Favorit Motors', city: 'Toronto', prov: 'ON', img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80', badge: 'Prix réduit' },
        { id: '3', year: 2008, trim: 'Coupe GT 2D | 4.6L V8 | Leather', price: 18223, km: 93742, trans: 'Manuelle', fuel: 'Essence', dealer: 'Auto Dépôt', city: 'Montréal', prov: 'QC', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', badge: 'Bon prix' },
        { id: '4', year: 2018, trim: 'EcoBoost Premium | Sieges Chauffants', price: 21500, km: 78000, trans: 'Automatique', fuel: 'Essence', dealer: 'H Grégoire', city: 'Laval', prov: 'QC', img: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80', badge: 'Bon prix' },
        { id: '5', year: 2015, trim: 'GT Premium V8 5.0L | Convertible', price: 27900, km: 64000, trans: 'Manuelle', fuel: 'Essence', dealer: 'Sainte-Foy Toyota', city: 'Québec', prov: 'QC', img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80', badge: 'Prix du marché' }
    ];

    // Application des filtres de recherche
    let filtered = rawListings.map((item, idx) => {
        const source = sources[idx % sources.length];
        return {
            ...item,
            brand: queryBrand,
            model: queryModel,
            province: province,
            sourceName: source.name,
            sourceUrl: source.url
        };
    }).filter(item => {
        const pMatch = item.price >= parseInt(minPrice) && item.price <= parseInt(maxPrice);
        const yMatch = item.year >= parseInt(minYear) && item.year <= parseInt(maxYear);
        const tMatch = transmission === 'all' || item.trans.toLowerCase() === transmission.toLowerCase();
        return pMatch && yMatch && tMatch;
    });

    // Tri des résultats
    if (sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'km_asc') filtered.sort((a, b) => a.km - b.km);

    res.json({ success: true, count: filtered.length, data: filtered });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
