import { sequence } from "@sveltejs/kit/hooks";
import { guardRoutes } from '$lib/auth/guardRoutes';
import { appendSessionToLocals } from "$lib/auth/appendSessionToLocals";
// import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
// import * as Sentry from '@sentry/sveltekit';

// Sentry.init({
//   dsn: 'https://3119475395f8fc70d95c2ec84dcffdcb@o4505930288922624.ingest.us.sentry.io/4507338444439552',
//   tracesSampleRate: 1.0,

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // spotlight: import.meta.env.DEV,  
// });

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(
  // sentryHandle(),
  appendSessionToLocals,
  guardRoutes
);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
// export const handleError = handleErrorWithSentry();
