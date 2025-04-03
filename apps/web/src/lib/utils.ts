import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function getCookie(cookieName: string) {
	const cookies = document.cookie;
	const cookieArray = cookies.split("; ");

	for (let i = 0; i < cookieArray.length; i++) {
		const cookie = cookieArray[i];
		const [name, value] = cookie.split("=");
		if (name === cookieName) {
			return decodeURIComponent(value);
		}
	}
	return null;
}