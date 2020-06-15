const express = require('express');

const { checkDna } = require('../middlewares/checkDna');

const dnaController = require('../controllers/dna');

const app = express();


app.post("/mutant", checkDna, dnaController.processDna);

app.get("/stats", dnaController.getStats);


module.exports = app;