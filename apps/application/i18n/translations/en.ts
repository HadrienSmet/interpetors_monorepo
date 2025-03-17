export const en = {
    translation: {
        inputs: {
            email: {
                label: "Email adress",
                placeholder: Math.random() < 0.5 ? "johndoe@mail.com" : "janedoe@mail.com",
            },
            password: {
                label: "Password",
                placeholder: "********",
            },
        },
        views: {
            sessions: {
                title: "Here is the sessions page",
            },
            welcome: {
                button: "Log in",
                errorMessages: {
                    email: "You must provide an email address to log in.",
                    password: "You must provide a password to log in.",
                },
                title: "Welcome back!",
            },
        },
    },
};
