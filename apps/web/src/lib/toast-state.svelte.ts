import { getContext, setContext } from 'svelte';
import { toast } from "svelte-sonner";

export type Toast = {
	id: string;
	title: string;
	message: string;
};

export class ToastState {
	toasts = $state<Toast[]>([]);
	add(title: string, {
		type,
		description,
		action,
		duration = 5000,
		promise
	}: {
		type: 'success' | 'warning' | 'error' | 'info' | 'promise',
		action?: { label: string, onClick: () => unknown },
		duration?: number
		description?: string
		promise?: {
			callback: Promise<() => unknown>
			loading: string,
			success: string,
			error: string
		}
	}) {

		switch (type) {
			case 'success':
				toast.success(title, { description, duration, action })
				break;

			case 'error':
				toast.error(title, { description, duration, action })
				break;
			case 'info':
				toast.info(title, { description, duration, action })
				break;
			case 'warning':
				toast.warning(title, { description, duration, action })
				break;
			case 'promise':
				if (promise)
					toast.promise(promise.callback, {
						loading: promise.loading,
						success: promise.success,
						error: promise.error,
						action
					})
				break;
			default:
				toast(title, { description, duration, action })
				break;
		}
	}


}

const TOAST_KEY = Symbol('TOAST');

export function setToastState() {
	return setContext(TOAST_KEY, new ToastState());
}

export function getToastState() {
	return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}
