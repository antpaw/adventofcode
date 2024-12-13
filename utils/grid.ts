export const compress = ([x, y]: number[], sizeX: number) =>
	compressXY(x, y, sizeX);

export const compressXY = (x: number, y: number, sizeX: number) => {
	return (x + 1) * (sizeX + 1) + (y + 1);
};

export const decompress = (coord: number, sizeX: number) => [
	Math.floor(coord / (sizeX + 1)) - 1,
	(coord % (sizeX + 1)) - 1,
];

export const compressTwoPoints = (
	first: number[],
	second: number[],
	sizeX: number,
) => {
	return compress(first, sizeX) * 10000 + compress(second, sizeX);
};

export const compressTwoPointsXY = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	sizeX: number,
) => compressTwoPoints([x1, y1], [x2, y2], sizeX);

export const decompressTwoPoints = (coord: number, sizeX: number) => {
	const first = Math.floor(coord / 10000);
	const second = coord % 10000;
	return [decompress(first, sizeX), decompress(second, sizeX)];
};
