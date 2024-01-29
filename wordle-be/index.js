const express = require("express");
const cors = require('cors');
const { GameService } = require("./app/game-service");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/start', (_, res) => {
    const response = GameService.initGame();

    res.send(response);
});

app.post('/check', (req, res) => {
    const { code, value } = req.body;

    const response = GameService.checkAttempt(code, value);

    res.send(response);
});

app.listen(port, () => {
    console.log(`Wordle app listening on port ${port}`)
});
