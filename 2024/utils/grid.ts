export const compress = ([row, col]: number[], rowSize: number) =>
	compressXY(row, col, rowSize);

export const compressXY = (row: number, col: number, rowSize: number) => {
	return (row + 1) * (rowSize + 1) + (col + 1);
};

export const decompress = (coord: number, sizeX: number) => [
	Math.floor(coord / (sizeX + 1)) - 1,
	(coord % (sizeX + 1)) - 1,
];

export const compressTwoPoints = (
	first: number[],
	second: number[],
	rowSize: number,
) => {
	return compress(first, rowSize) * 10000 + compress(second, rowSize);
};

export const compressTwoPointsXY = (
	row1: number,
	col1: number,
	row2: number,
	col2: number,
	rowSize: number,
) => compressTwoPoints([row1, col1], [row2, col2], rowSize);

export const decompressTwoPoints = (coord: number, sizeX: number) => {
	const first = Math.floor(coord / 10000);
	const second = coord % 10000;
	return [decompress(first, sizeX), decompress(second, sizeX)];
};

export const absModulo = (n: number, m: number) => {
	return ((n % m) + m) % m;
};
