const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
    clientId: 'beb5a8243a6c4b9e8acfc66dcf82f1b1',
    clientSecret: fs.readFileSync(__dirname + '/secrets/spotifyClientSecret'),
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log(
            'Something went wrong when retrieving an access token',
            err.message
        );
    }
);

app.post('/', (req, res) => {
    const { artist, album } = req.body;

    spotifyApi
        .searchAlbums(`album:${album} artist:${artist}`)
        .then(response => {
            res.send(JSON.stringify(response.body.albums.items));
        });
});

const options = {
    key: fs.readFileSync(__dirname + '/secrets/localhost.key'),
    cert: fs.readFileSync(__dirname + '/secrets/localhost.cert'),
};

https.createServer(options, app).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
