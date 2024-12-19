import { error } from '@sveltejs/kit';
import * as EmailValidator from 'email-validator';

/** @type {import('./$types').PageLoad} */
export function load({ params }: { params: { results_string: string } }) {
	const { results_string } = params;
	const matches = [...results_string.matchAll(new RegExp(/([a-h])([1-5])/gi))];
	if (matches.length !== 8) {
		error(404, 'invalid match string');
	}
	return {
		answers: matches.map((m) => {
			// matches is an array of arrays with values like
			// ['h2', 'h', '2', index: 14, ...]
			return { key: m[1].toUpperCase(), value: m[2] };
		}),
		object: matches.reduce((prev: Record<string, number>, curr) => {
			prev[curr[1].toUpperCase()] = parseInt(curr[2], 10);
			return prev;
		}, {}),
		results_string
	};
}

export async function _sendEmail(
	email: string,
	results_string: string
): Promise<{ success: boolean; message?: string; invalidFormat?: boolean }> {
	try {
		const response = await fetch('/api/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, results_string })
		});

		if (!response.ok) {
			// bad request
			if (response.status === 400) {
				return { success: false, invalidFormat: true };
			} else {
				throw new Error('Failed to send email');
			}
		} else {
			return { success: true };
		}
	} catch (err: Error) {
		return { success: false, message: err.message };
	}
}

export const csr = true;
export const prerender = false;
