const gm = require('gm');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(fs.readdir);

const inputFolder = 'input';
const outputFolder = 'output';

function processFile(filename) {
	const fullInputFilename = path.join(inputFolder, filename);
	gm(fullInputFilename).size((err, size) => {
		const { height, width } = size;

		const orientation =
			height === width ? 'square' : height > width ? 'portrait' : 'landscape';

		const newHeight = orientation === 'landscape' ? height * 2 : height;

		const newWidth = orientation === 'portrait' ? width * 2 : width;

		const offsetX = orientation === 'portrait' ? width : 0;

		const offsetY = orientation === 'landscape' ? height : 0;

		const filenameWithoutExtension = path.basename(filename, '.png');
		const pdfFilename = `${filenameWithoutExtension}.pdf`;

		gm(fullInputFilename)
			.extent(newWidth, newHeight, `-${offsetX}-${offsetY}`)
			.write(path.join(outputFolder, pdfFilename), (err) => {
				if (err) {
					throw err;
				}
				console.log(`Wrote ${pdfFilename}`);
			});
	});
}

readdirAsync(inputFolder).then((filenames) => {
	filenames.forEach((filename) => {
		processFile(filename);
	});
});
