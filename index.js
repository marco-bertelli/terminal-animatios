import { loadFrames, selectColor, colorsOptions } from './utils.js';
import { Readable } from 'stream';

import colors from 'colors';
import http from 'http';

const { original } = await loadFrames();

const streamer = (stream) => {
    let index = 0;
    let lastColor;

    return setInterval(() => {
        stream.push('\x1b[2J\x1b[3J\x1b[H');

        const newColor = selectColor(lastColor);

        lastColor = newColor;

        stream.push(colors[colorsOptions[newColor]](original[index]));

        index = (index + 1) % original.length;
    }, 1000);
};

const server = http.createServer((req, res) => {
    if (
        req.headers &&
        req.headers['user-agent'] &&
        !req.headers['user-agent'].includes('curl')
    ) {
        res.writeHead(302, { Location: 'https://github.com/marco-bertelli/terminal-animatios' });
        return res.end();
    }

    const stream = new Readable();

    stream._read = () => { };

    stream.pipe(res);

    const interval = streamer(stream);

    req.on('close', () => {
        stream.destroy();
        clearInterval(interval);
    });
});

const port = process.env.PORT || 3000;

server.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on localhost:${port}`);
});