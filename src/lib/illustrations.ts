import type { SectionIllustrations } from '$lib/types';

import hero0Left from './assets/hero-0-left.png';
import hero0Right from './assets/hero-0-right.png';
import hero1Right from './assets/hero-1-right.png';
import hero2Left from './assets/hero-2-left.png';
import hero3Left from './assets/hero-3-left.png';
import hero3Right from './assets/hero-3-right.png';
import hero4Left from './assets/hero-4-left.png';
import hero4Right from './assets/hero-4-right.png';
import hero5Left from './assets/hero-5-left.png';
import hero6Right from './assets/hero-6-right.png';
import hero7Left from './assets/hero-7-left.png';

const illustrations: Record<number, SectionIllustrations> = {
	0: {
		left: hero0Left,
		right: hero0Right
	},
	1: {
		right: hero1Right
	},
	2: {
		left: hero2Left
	},
	3: {
		left: hero3Left,
		right: hero3Right
	},
	4: {
		left: hero4Left,
		right: hero4Right
	},
	5: {
		left: hero5Left
	},
	6: {
		right: hero6Right
	},
	7: {
		left: hero7Left
	}
};

export default illustrations;
