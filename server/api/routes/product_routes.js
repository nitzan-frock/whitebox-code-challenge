const https = require('../utility/https');

module.exports = function (app, url) {
    app.get('/getMany', (req, res) => {
        const send = data => {
            //res.append('Access-Control-Allow-Origin', ['*']);
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

            res.send(singleItem[0]);
        }
        
        https.get(url, send);
    });
}