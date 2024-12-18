import mailchimp from '@mailchimp/mailchimp_transactional';
import { env } from '$env/dynamic/private';
import dynamics from '$lib/dynamics';
import type { MessageRecipient } from '@mailchimp/mailchimp_transactional';

const apiKey = env.MAILCHIMP_API_KEY;
const client = mailchimp(apiKey ?? '');

export async function POST({ request }) {
	try {
		const { email, results } = await request.json();
		// todo: include email validation
		const features = Object.keys(results);

		const message = {
			to: [{ email, type: 'to' } as MessageRecipient],
			from_email: 'info@allwecansave.earth',
			subject: '8 Dynamics - Your Results',
			html: `<h1>Your Results: </h1>
				<div>
				${dynamics.map((d, i) => `<span>${d.short}: ${results[features[i]]}</span>`)}
				</div>
			`
		};

		const response = await client.messages.send({ message });
		if (Array.isArray(response)) {
			const result = response[0];
			if (result.status === 'sent') {
				return new Response(JSON.stringify({ success: true }), { status: 200 });
			} else {
				throw new Error(`${result.reject_reason}`);
			}
		}

		throw new Error(response.message);
	} catch (err) {
		return new Response(JSON.stringify({ error: `Failed to send email. ${err}` }), { status: 500 });
	}
}
