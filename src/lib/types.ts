export interface Section {
	key: string;
	dynamic: string;
	el: HTMLElement | undefined;
	value: number;
	bgImages: SectionIllustrations;
}

export type SectionIllustrations = {
	left?: string;
	right?: string;
};

declare global {
	interface Window {
		sa_event: CallableFunction;
		sa_loaded: boolean;
	}
}
