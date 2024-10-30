// server.js

const express = require('express');
const bodyParser = require('body-parser');

const startServer = () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Endpoint pour recevoir les réponses du bot
    app.post('/webhook', (req, res) => {
        const { type, payload, conversationId, botpressUserId } = req.body;

        console.log('Received response from Botpress:', {
            type,
            payload,
            conversationId,
            botpressUserId
        });

        // Vous pouvez ajouter ici la logique pour envoyer la réponse à WhatsApp
        res.sendStatus(200); // Répondre avec un statut 200 OK
    });

    // Démarrer le serveur
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// Exporter la fonction pour démarrer le serveur
module.exports = { startServer };
