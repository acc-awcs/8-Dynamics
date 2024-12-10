import sgMail from '@sendgrid/mail';

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

export async function POST({ request }) {
	try {
		const { email, username, results } = await request.json();

		const msg = {
			to: email,
			from: 'info@allwecansave.earth',
			subject: '8 Dynamics - Your Results',
			html: `
        <h1>Hello, ${username}!</h1>
        <p>Here are your results:</p>
        <ul>
          ${results.map((result) => `<li>${result}</li>`).join('')}
        </ul>
      `
		};

		await sgMail.send(msg);

		return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
	}
}
