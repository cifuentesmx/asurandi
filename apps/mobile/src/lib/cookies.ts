export const setCookie = (key: string, value: string) => {
    document.cookie = `${key}=${value};path=/;samesite=strict;`;
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