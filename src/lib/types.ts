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
