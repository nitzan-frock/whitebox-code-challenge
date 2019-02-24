const https = require('https');

module.exports = function(app, url) {
    app.get('/getMany', (req, res) => {
        const send = data => {
            res.send(data);
        };

        retrieveJSON(url, send);    
    });

    app.get('/getSingle/:id', (req, res) => {
        const send = data => {
            const id = req.params.id;
            const singleItem = data.filter(item => {
                return item._id === id ? true : false;
            });

            res.send(singleItem);
        }
        
        retrieveJSON(url, send);
    });

    const retrieveJSON = (url, send) => {
        let data = '';
        https.get(url, res => {
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                send(JSON.parse(data));
            });
        }).on('error', err => {
            console.log(`Error: ${err.message}.`);
        });
    }
}