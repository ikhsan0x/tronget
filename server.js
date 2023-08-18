const express = require("express");
const bodyParser = require("body-parser");
const Tron = require('./class.js');

const app = express();
const HTTP_PORT = 8008;
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get("/getTrxBalance", async function(req, res, next) {
    try {
        let errors = [];
        if (!req.query.apikey) {
            errors.push("No apikey specified");
        }
        if (!req.query.address) {
            errors.push("No address specified");
        }
        if (errors.length) {
            res.status(400).json({
                "error": errors.join(",")
            });
            return;
        }

        let apikey = req.query.apikey;
        let address = req.query.address;

        const trons = new Tron(apikey);
        let result = await trons.coinBalance(address);

        res.json(result);
    }
    catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
});

app.get("/getTrc20Balance", async function(req, res, next) {
    try {
        let errors = [];
        if (!req.query.apikey) {
            errors.push("No apikey specified");
        }
        if (!req.query.token) {
            errors.push("No token specified");
        }
        if (!req.query.address) {
            errors.push("No address specified");
        }
        if (errors.length) {
            res.status(400).json({
                "error": errors.join(",")
            });
            return;
        }

        let apikey = req.query.apikey;
        let token = req.query.token;
        let address = req.query.address;

        const trons = new Tron(apikey);
        let result = await trons.tokenBalance(token, address);

        res.json(result);
    }
    catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
});

app.get("/getTotalSupply", async function(req, res, next) {
    try {
        let errors = [];
        if (!req.query.apikey) {
            errors.push("No apikey specified");
        }
        if (!req.query.token) {
            errors.push("No token specified");
        }
        if (errors.length) {
            res.status(400).json({
                "error": errors.join(",")
            });
            return;
        }

        let apikey = req.query.apikey;
        let token = req.query.token;

        const trons = new Tron(apikey);
        let result = await trons.totalSupply(token);

        res.json(result);
    }
    catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
});

app.get("/", (req, res, next) => {
    res.json({
        "status": "running"
    })
});

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
