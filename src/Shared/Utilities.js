export const validEmail = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');

export const validPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export const errMessages = (errMessages) => {
    switch (errMessages) {
        case ("Firebase: Error (auth/user-not-found)."):
            return ("User Not Exist Please Register")
        case ("Firebase: Error (auth/email-already-in-use)."):
            return ("User Already Exists ")
        case ("Firebase: Error (auth/invalid-email)."):
            return ("Enter Valid Email")
        case ("Firebase: Error (auth/wrong-password)."):
            return ("Incorrect password")
        default:
            return (errMessages)
    }
}