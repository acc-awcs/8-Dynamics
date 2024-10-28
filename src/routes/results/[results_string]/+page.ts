import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }: { params: { results_string: string } }) {
	const matches = [...params.results_string.matchAll(new RegExp(/([a-h])([1-5])/gi))];
	if (matches.length !== 8) {
		error(404, 'invalid match string');
	}
	return {
		answers: matches.map((m) => {
			// matches is an array of arrays with values like
			// ['h2', 'h', '2', index: 14, ...]
			return { key: m[1].toUpperCase(), value: m[2] };
		})
	};
}

export const csr = true;
export const prerender = false;
