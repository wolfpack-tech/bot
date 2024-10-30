const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Crée le client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// Génére le QR code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scanne le QR code avec WhatsApp pour te connecter.');
});

// Indique quand le client WhatsApp est prêt
client.on('ready', () => {
    console.log('Client WhatsApp prêt!');
});

// Initialise l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour traiter les requêtes JSON
app.use(bodyParser.json());

// Gère les messages entrants
client.on('message', async (message) => {
    console.log(`Message reçu : ${message.body}`);

    try {
        // Envoie le message reçu à Botpress Messaging API
        const response = await axios.post('https://webhook.botpress.cloud/8079f124-3390-438f-89f3-bc518f86fe93', {
            type: 'text',
            text: message.body,
            conversationId: message.from,
            user: {
                id: message.from,
                name: message._data.notifyName
            }
        });

        // Récupère la réponse de Botpress Messaging API
        const { conversationId, text } = response.data; // Adapte selon la structure de réponse

        // Envoie la réponse à l'utilisateur WhatsApp
        await client.sendMessage(conversationId, text);

    } catch (error) {
        console.error('Erreur lors de la communication avec Botpress Messaging API:', error);
        client.sendMessage(message.from, 'Désolé, une erreur est survenue lors de la communication avec le bot.');
    }
});

// Démarre le serveur Express
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Route pour recevoir les messages de WhatsApp via Botpress Messaging API  
app.post('/messages', async (req, res) => {
    const { conversationId, text } = req.body;

    // Envoie le message à l'utilisateur WhatsApp
    await client.sendMessage(conversationId, text);

    res.sendStatus(200);
});

// Initialise le client WhatsApp
client.initialize();
