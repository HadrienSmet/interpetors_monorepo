import { APP_NAME } from "@/constants";

export const fr = {
    translation: {
        actions: {
            add: "Ajouter",
			apply: "Appliquer",
			close: "Fermer",
            confirm: "Confirmer",
            download: "Télécharger",
            editOnDoubleClick: "Cliquez deux fois pour éditer",
            save: "Sauvegarder",
            search: "Rechercher",
            update: "Mettre à jour",
            workspaces: {
                create: "Créer mon espace de travail",
            },
        },
        auth: {
            email: {
                label: "Email",
                placeholder: "exemple@mail.com",
                requirements: {
                    main: "Email doit être une adresse email valide",
                },
            },
            errors: {
                already_exists: "Un autre compte utilise déjà cette addresse email.",
                wrong_credentials: "Identifiants incorrects",
            },
            locked: {
                explanations: "Afin de garantir la sécurité de vos données, veuillez entrer votre mot de passe pour débloquer votre session.",
                title: "Session bloquée",
            },
            password: {
                label: "Mot de passe",
                placeholder: "********",
                requirements: {
                    main: "Un mot de passe valide requière:",
                    conditions: {
                        "0": "Minimum 8 caractères",
                        "1": "Minimum 1 majuscule",
                        "2": "Minimum 1 minuscule",
                        "3": "Minimum 1 chiffre",
                        "4": "Minimum 1 symbole",
                    },
                },
            },
            signin: "Connexion",
            signingIn: "Me connecter",
            signingUp: "Créer mon compte",
            signout: "Me déconnecter",
            signup: "Inscription",
            toSignin: "J'ai déjà un compte",
            toSignup: "Me créer un compte",
        },
        colorPanel: {
            creation: {
                action: "Créer une palette de couleur",
                title: "Création d'une palette de couleur"
            },
            colors: {
                label: "Définis tes couleurs",
                placeholder: "Sources",
            },
            displayer: {
                color: "COULEUR",
                name: "NOM",
            },
            missing: "Aucune palette de couleur n'a été trouvée",
            title: {
                label: "Défini un titre",
                placeholder: "Palette par défaut",
            },
            update: {
                title: "Modifies ta palette de couleur.",
            },
            used: "Palette de couleur utilisée: {{name}}",
        },
        commons: {
			all: "Tout",
            createdAt: "Créé le {{date}}",
        },
        files: {
            "context-menu": {
                delete: "Supprimer le fichier",
				language: "Définir la langue du fichier",
                rename: "Renommer le fichier",
            },
            editor: {
                "context-menu": {
                    highlight: "Surligner la sélection",
                    note: "Créer une note à partir de la sélection",
                    underline: "Souligner la sélection",
                    vocabulary: "Ajouter au vocabulaire",
                },
                tools: {
                    backward: "Retour en arrière",
                    brush: "Pinceau",
                    close: "Fermer la palette d'outils",
                    color: "Changer la couleur",
                    drag: "Déplacer la palette d'outils",
                    forward: "Avancer",
                    highlight: "Surligner",
                    horizontal: "Afficher horizontalement",
                    note: "Ajouter une note",
                    open: "Ouvrir la palette d'outils",
                    underline: "Souligner",
                    vertical: "Afficher verticalement",
                    vocabulary: "Ajouter au vocabulaire"
                }
            },
            unsupported: "{{type}} sera supporté prochainement",
        },
        folders: {
            close_one: "Fermer le dossier",
            close_other: "Fermer tous les dossiers",
            "context-menu": {
                create: "Nouveau dossier",
                delete: "Supprimer le dossier",
                rename: "Renommer le dossier",
            },
            download_one: "Télécharger le dossier",
            download_other: "Télécharger les dossiers",
            empty: "Aucuns fichiers dans cette préparation",
            label: "Dossiers",
			languagesTree: {
				title: "Veuillez définir une langue pour chacun des fichiers",
			},
        },
        inputs: {
            folders: {
                empty: "<default>Glissez-déposez un dossier ici</default><default>(fichiers supportés: pdf)</default>",
                unselected: "Sélectionnez un fichier pour afficher son contenu",
                unsupported: "Type de fichier non supporté. Types de fichier supportés: ",
            },
            notRequired: "Facultatif",
        },
        navigation: {
            buttons: {
                dictionary: "Dictionnaire",
                files: "Dossiers sources",
                home: "Mon espace de travail",
                manager: "Manager",
                preparations: "Mes préparations",
                prepare: "Nouvelle préparation",
                vocabulary: "Vocabulaire",
                workspaces: "Mes espaces de travail",
            },
        },
        notes: {
            add: "Ajouter une note",
            groupHeader_one: "<default><strong>{{count}}</strong> note créée</default>",
            groupHeader_other: "<default><strong>{{count}}</strong> notes crées</default>",
            navigate: "Naviguer vers la note",
            placeholder: "Ecris ta note",
            readOnClick: "Cliquer pour afficher l'entièreté.",
        },
        onBoarding: {
            title: `<default>Bienvenue sur <title>${APP_NAME}</title></default`,
            subtitle: "L'outil professionnel pour travailler avec les langues",
        },
        onConstruction: "Serveurs en construction",
        preparations: {
            backToList: "Retour à la liste des préparations",
            empty: "Aucunes préparations trouvées",
            new: "Créer une préparation",
            save: "Sauver la préparation",
            stats: {
                files: "<default><strong>{{amount}}</strong> fichiers</default>",
                terms: "<default><strong>{{amount}}</strong> termes de vocabulaires</default>",
            },
        },
        views: {
            dic: {
                title: "Dictionnaire généré",
            },
            home: {
                title: "Mon espace de travail",
                sections: {
                    languages: "Langages",
                    colorPanel: "Palette de couleur",
                },
            },
            new: {
                buttons: {
                    downloadFiles: "Télécharger les fichiers",
                    downloadVocabulary: "Télécharger le vocabulaire",
                    save: "Sauvegarder la préparation",
                },
                title: "Définissez un titre à votre préparation.",
            },
            notFound: {
                title: "Oops, on s'est perdu ?",
                buttonLabel: "Retour en sécurité"
            },
        },
        vocabulary: {
            empty: "Pas de vocabulaire généré pour le moment",
            filterLabel: "Colonne sur laquelle appliquer le filtre",
            label: "Vocabulaire",
            placeholders: {
                cell: "Traduis {{ word }} ({{ language }})",
                search: "Rechercher dans le vocabulaire généré",
            },
            sources: "Sources",
        },
        workspaces: {
            create: {
                title: "Crées ton environnement de travail personnalisé.",
                inputs: {
                    title: {
                        label: "Définissez un titre à votre espace de travail",
                        errorMessages: {
                            length: "La longueur du titre doit être comprise entre 3 et 45 caractères.",
                        },
                    },
                    "work-languages": {
                        label: "Définissez les langues avec lesquelles vous pratiquez",
                        errorMessages: {
                            length: "Sélectionnez deux langues minimum",
                        },
                    },
                    "native-language": {
                        label: "Choisissez-en une en tant que langue maternelle.",
                    },
                },
            },
            new: "Créer un nouvel espace de travail",
            stats: {
                encyclopedy_one: "{{count}} définition dans l'encyclopédie",
                encyclopedy_other: "{{count}} définitions dans l'encyclopédie",
                preparation_one: "{{count}} préparation",
                preparation_other: "{{count}} préparations",
                vocabulary_one: "{{count}} mot de vocabulaire généré",
                vocabulary_other: "{{count}} mots de vocabulaire générés",
            }
        },
    },
};
