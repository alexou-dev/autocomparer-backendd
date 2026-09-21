const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de recherche et agrégation d'annonces
app.get('/api/search', async (req, res) => {
    const { brand, model, yearMin, yearMax, province, sortBy } = req.query;

    let results = [];

    try {
        //Exemple de récupération/scraping d'annonces (ex. Kijiji / AutoTrader)
        //Vous pouvez étendre les scrapers ici pour alimenter la liste 'results'
        
        //Exemple de structure de données retournée :
        /*
        results.push({
            id: '1',
            brand: brand || 'Ford',
            model: model || 'Mustang',
            year: 2018,
            price: 24500,
            km: 75000,
            city: 'Montréal',
            province: province || 'QC',
            sourceName: 'Kijiji Autos',
            sourceUrl: 'https://www.kijijiautos.ca/...',
            image: 'https://...'
        });
        */

        // Appliquer le tri selon la demande de l'utilisateur
        if (sortBy === 'price_asc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'km_asc') {
            results.sort((a, b) => a.km - b.km);
        } else if (sortBy === 'year_desc') {
            results.sort((a, b) => b.year - a.year);
        }

        res.json({ success: true, count: results.length, data: results });
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des annonces." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});