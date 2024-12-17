// Ordering matters here
const dynamics = [
	{
		short: 'Motivation',
		full: 'I hold deep motivations to foster a just, life-giving future.'
	},
	{
		short: 'Connection',
		full: 'I feel connected to Earth and kindred community.'
	},
	{
		short: 'Story',
		full: 'I can see myself in the unfolding, collective climate story.'
	},
	{
		short: 'Emotions',
		full: 'I’m able to work with climate emotions and access healing and rest.'
	},
	{
		short: 'Understanding',
		full: 'I understand climate truth, just solutions, and leverage points for change.'
	},
	{
		short: 'Clarity',
		full: 'I have clarity around my contribution, while embracing its evolution.'
	},
	{
		short: 'Action',
		full: 'I find footholds for meaningful action and collaboration.'
	},
	{
		short: 'Possibility',
		full: 'I have a sense of possibility, authentic power, and joy in the work.'
	}
];

export const rotateDynamic = (current: number, delta: number) => {
	const selected = current + delta;
	if (selected >= dynamics.length) {
		// if we went over the number of dynamics, restart at 0
		return 0;
	} else if (selected < 0) {
		// if we went under the first dynamic, set to last
		return dynamics.length - 1;
	}
	return selected;
};

export default dynamics;
