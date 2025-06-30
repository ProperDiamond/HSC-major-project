const cors = require('cors');
const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
res.sendFile(path.join(__dirname, "public/html/index.html"));
});

app.use(bodyParser.json());





app.listen(8000, () => console.log("Server is running on Port 8000, visit http://localhost:8000/ or http://127.0.0.1:8000 to access your website") );


app.post("/api/eventsadd", async (req, res) => {
    const events = req.body
    //console.log(events)
    //const append = JSON.parse(events)
    fs.writeFile('events.json', JSON.stringify(events), (e) => {
        if (e) {
            console.error('Error writing file:', e);
            return;
        }
        console.log('File written successfully');
    });
    res.json({ status: 'ok'});
});





app.get("/api/eventsview", async (req, res) => {
    fs.stat('events.json', (err, stats) => {
        if (err) {
            console.error('Error reading file stats:', err);
            return res.status(404).json({ status: 'file not found' });
        }
        if (stats.size === 0) {
            return res.json({ status: 'file empty'});
        } else {
            fs.readFile('events.json','utf-8', (e, data) => {
                if (e) {
                    console.error('Error viewing file:', e);
                }
                console.log('File viewed successfully');
                const response = JSON.parse(data)
                console.log(response)
                return res.json(response);
            });
        }
    });
});



