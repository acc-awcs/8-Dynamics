import mailchimp from '@mailchimp/mailchimp_transactional';
import { env } from '$env/dynamic/private';

const apiKey = env.MAILCHIMP_API_KEY;
const client = mailchimp(apiKey ?? '');

export async function POST({ request }) {
	try {
		const { email, results_string } = await request.json();
		// todo: include email validation

		const message = {
			template_name: 'eight-dynamics',
			template_content: [
				{
					name: 'results_link',
					content: `Thank you for spending some time with the 8 Dynamics of Climate Engagement! Your results are <a href="${process.env.BASE_URL}/results/${results_string}" style="color: #303326; text-decoration: underline">here</a>.`
				}
			],
			message: {
				from_email: 'info@allwecansave.earth',
				to: [
					{
						email: email,
						name: ''
					}
				]
			}
		};

		const response = await client.messages.sendTemplate(message);
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
