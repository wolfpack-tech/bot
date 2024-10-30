// whatsapp.js

const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// Fonction pour démarrer le client WhatsApp
const startWhatsAppClient = () => {
    const client = new Client({
        authStrategy: new LocalAuth()
    });

    // Lorsque le client est prêt
    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
    });

    // Écouter les messages entrants
    client.on('message', async (message) => {
        console.log('Received message:', message.body);

        // Préparer les données à envoyer au webhook de Botpress
        const data = {
            userId: message.from,
            messageId: message.id.id,
            conversationId: message.from,
            type: 'text',
            text: message.body,
            payload: {}
        };

        try {
            // Envoyer une requête HTTP POST au webhook de Botpress
            const response = await axios.post('https://webhook.botpress.cloud/8079f124-3390-438f-89f3-bc518f86fe93', data);
            console.log('Response from Botpress:', response.data);
        } catch (error) {
            console.error('Error sending message to Botpress:', error);
        }
    });

    // Initialiser le client WhatsApp
    client.initialize();
};

// Exporter la fonction pour démarrer le client
module.exports = { startWhatsAppClient };
