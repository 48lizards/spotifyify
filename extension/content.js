function post(url = '', data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.json());
}

const [artist, album] = document
    .querySelector('#sectionHead h1')
    .innerHTML.split(' - ');

post('https://localhost:3000', {
    artist,
    album,
}).then(async results => {
    const uri = results[0]['uri'];
    const player = document.createElement('iframe');
    player.src = 'https://embed.spotify.com/?uri=' + encodeURIComponent(uri);
    player.width = 300;
    player.height = 300;
    player.allowtransparency = true;

    document.querySelector('.reviewDetails').appendChild(player);
});
