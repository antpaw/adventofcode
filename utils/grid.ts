export const compress = ([x, y]: number[], sizeX: number) => x * sizeX + y;
export const compressXY = (x: number, y: number, sizeX: number) =>
	x * sizeX + y;
export const decompress = (coord: number, sizeX: number) => [
	Math.floor(coord / sizeX),
	coord % sizeX,
];
