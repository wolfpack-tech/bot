// bot.js

const express = require('express');
const bodyParser = require('body-parser');
const { startWhatsAppClient } = require('./whatsapp'); // Importer la fonction pour démarrer le client WhatsApp
const { startServer } = require('./server'); // Importer la fonction pour démarrer le serveur

// Démarrer le client WhatsApp
startWhatsAppClient();

// Démarrer le serveur
startServer();
