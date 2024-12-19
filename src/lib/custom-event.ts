export default function trackEvent(eventName: string) {
	if (!eventName || !window?.sa_event || !window?.sa_loaded) return;

	window.sa_event(eventName);
	return;
}
