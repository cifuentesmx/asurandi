// import type { IdTokenResult } from 'firebase/auth';
// import { decodeToken } from './../../front-end/src/routes/api/session/decodeToken';
import type { AuthedUser, CustomClaims } from './types/authed-user';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			friendlyMessage?: string
		}
		interface Locals {
			authedUser: AuthedUser & CustomClaims | null
			saasId?: string
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
