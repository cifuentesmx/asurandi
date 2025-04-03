import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/firebase/app.client';
import { FirebaseError } from 'firebase/app';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            await user.getIdToken()
                .catch(() => {
                    throw error(400, { message: 'Hubo un error al iniciar sesión con Google' })
                });
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        })
        .catch((e) => {
            const ok_error_codes = ['auth/cancelled-popup-request']
            if (e instanceof FirebaseError && ok_error_codes.includes(e.code)) {
                return
            }
            throw error(400, { message: 'Hubo un error al iniciar sesión con Google' })
        })

}