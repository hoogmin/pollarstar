// Only alphanumeric characters (A-Z, a-z, 0-9), with a max length of 15-20 characters.
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

// Basic email format like example@example.com
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

export function validateUsername(username: string | null | undefined): boolean {
    if (!username) {
        return false
    }

    return usernameRegex.test(username)
}

export function validateEmail(email: string | null | undefined): boolean {
    if (!email) {
        return false
    }

    return emailRegex.test(email)
}

export function validatePassword(password: string | null | undefined): boolean {
    if (!password) {
        return false
    }

    return passwordRegex.test(password)
}