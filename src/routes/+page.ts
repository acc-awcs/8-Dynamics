import dynamics from '$lib/dynamics';

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		dynamics
	};
}

// we need JS for scroll behavior and form submission
export const csr = true;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
