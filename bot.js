const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const app = express();
const port = 5000; // Choisis ton port

// Initialisation du client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    // Tu peux afficher le QR Code ici sur la page principale de ton mini site
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Capture des messages entrants et envoi à Botpress
client.on('message', msg => {
    const messageText = msg.body;
    const chatId = msg.from;

    axios.post('https://webhook.botpress.cloud/8079f124-3390-438f-89f3-bc518f86fe93', {
        type: 'text',
        text: messageText,
        chatId: chatId
    })
        .then(response => {
            // Recevoir la réponse de Botpress et la renvoyer à WhatsApp
            const botResponse = response.data.response;
            client.sendMessage(chatId, botResponse);
        })
        .catch(error => {
            console.error('Error sending message to Botpress:', error);
        });
});

client.initialize();

// Serveur HTTP pour afficher le QR Code et autres informations
app.get('/', (req, res) => {
    res.send('<h1>Bienvenue sur votre mini app Node.js avec WhatsApp</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
