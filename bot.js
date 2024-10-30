const axios = require('axios');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const bodyParser = require('body-parser');
const express = require('express');

// Crée le client WhatsApp avec une stratégie d'authentification locale pour sauvegarder la session
const client = new Client({
    authStrategy: new LocalAuth()
});

// Génère et affiche le QR code pour se connecter à WhatsApp
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scanne le QR code avec WhatsApp pour te connecter.');
});

// Indique quand le client WhatsApp est prêt
client.on('ready', () => {
    console.log('Client WhatsApp prêt!');
});

// Crée le serveur Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour traiter les requêtes JSON
app.use(bodyParser.json());

// Gère les messages entrants
client.on('message', async (message) => {
    console.log(`Message reçu : ${message.body}`);

    try {
        // Envoie le message reçu à Botpress Messaging API via l'URL de webhook
        const response = await axios.post('https://webhook.botpress.cloud/8079f124-3390-438f-89f3-bc518f86fe93', {
            type: 'text',
            text: message.body,
            conversationId: message.from,
            user: {
                id: message.from,
                name: message._data.notifyName
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Récupère la réponse de Botpress Messaging API
        const { conversationId, text } = response.data;

        // Envoie la réponse à l'utilisateur WhatsApp
        await client.sendMessage(conversationId, text);
    } catch (error) {
        console.error('Erreur lors de la communication avec Botpress Messaging API:', error);
        client.sendMessage(message.from, 'Désolé, une erreur est survenue lors de la communication avec le bot.');
    }
});

// Écoute les réponses de Botpress via l'endpoint configuré
app.post('/webhook', async (req, res) => {
    const { conversationId, text } = req.body;

    console.log('Réponse reçue de Botpress:', req.body);

    try {
        // Envoie la réponse à l'utilisateur WhatsApp correspondant
        await client.sendMessage(conversationId, text);
        res.status(200).send('Message envoyé à WhatsApp');
    } catch (error) {
        console.error('Erreur lors de l\'envoi à WhatsApp:', error);
        res.status(500).send('Erreur lors de l\'envoi à WhatsApp');
    }
});

// Démarre le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Initialise le client WhatsApp
client.initialize();
