const https = require('../utility/https');

module.exports = function (app, url) {
    app.get('/getMany', (req, res) => {
        const send = data => {
            res.send(data);
        };

        https.get(url, send);    
    });

    app.get('/getSingle/:id', (req, res) => {
        const send = data => {
            const id = req.params.id;
            
            const singleItem = data.filter(item => {
                return item._id === id ? true : false;
            });

            res.send(singleItem);
        }
        
        https.get(url, send);
    });
}