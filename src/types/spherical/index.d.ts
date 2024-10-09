declare module 'spherical' {
	export type Point = [number, number];

	export function distance(from: Point, to: Point, radius?: number): number;
}
