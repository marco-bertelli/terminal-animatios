import path from 'path';
import fs from 'fs';

const framesPath = 'frames';

export function loadFrames() {
    const files = fs.readdirSync(framesPath);

    const mappedFrames = files.map((file) => {
        const frame = fs.readFileSync(path.join(framesPath, file));

        return frame.toString();
    });

    const flipped = mappedFrames.map(f => {
        return f
            .toString()
            .split('')
            .reverse()
            .join('')
    })

    return { original: mappedFrames, flipped };
}

export const colorsOptions = [
    'red',
    'yellow',
    'green',
    'blue',
    'magenta',
    'cyan',
    'white'
];

const numColors = colorsOptions.length;

export function selectColor(previousColor) {
    let color;

    do {
        color = Math.floor(Math.random() * numColors);
    } while (color === previousColor);

    return color;
};