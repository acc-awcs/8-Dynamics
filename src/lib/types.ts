export interface Section {
	key: string;
	dynamic: string;
	el: HTMLElement | undefined;
	value: number;
	bgImages: SectionIllustrations;
}

type ImageData = {
	image: string;
	className: string;
};

export type SectionIllustrations = {
	left?: ImageData;
	right?: ImageData;
};
