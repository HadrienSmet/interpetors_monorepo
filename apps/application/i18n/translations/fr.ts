export const fr = {
    translation: {
        inputs: {
            email: {
                label: "Adresse email",
                placeholder: Math.random() < 0.5 ? "johndoe@mail.com" : "janedoe@mail.com",
            },
            password: {
                label: "Mot de passe",
                placeholder: "********",
            },
        },
        views: {
            sessions: {
                title: "Bijour je serai la page des sessions",
            },
            welcome: {
                button: "Se connecter",
                errorMessages: {
                    email: "Vous devez fournir une adresse email pour vous connecter.",
                    password: "Vous devez fournir un mot de passe pour vous connecter.",
                },
                title: "Heureux de vous revoir !",
            },
        },
    },
};
