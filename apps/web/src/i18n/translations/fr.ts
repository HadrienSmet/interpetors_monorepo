import { APP_NAME } from "@/constants";

export const fr = {
    translation: {
        actions: {
            add: "Ajouter",
            confirm: "Confirmer",
            download: "Télécharger",
            editOnDoubleClick: "Cliquez deux fois pour éditer",
            search: "Rechercher",
            workspaces: {
                create: "Créer mon espace de travail",
            },
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
            title: {
                label: "Défini un titre",
                placeholder: "Palette par défaut",
            },
            missing: "Aucune palette de couleur n'a été trouvée"
        },
        files: {
            "context-menu": {
                delete: "Supprimer le fichier",
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
            }
        },
        inputs: {
            folders: {
                empty: "Glissez-déposez un dossier ici",
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
                preparations: "Anciennes préparations",
                prepare: "Nouvelle préparation",
                vocabulary: "Vocabulaire",
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
        views: {
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
                "context-menu": {
                    folder: {
                        create: "Nouveau dossier",
                        delete: "Supprimer le dossier",
                        rename: "Renommer le dossier",
                    },
                },
                inputs: {
                    "meeting-documents": "Fournissez les documents relatifs à la réunion à laquelle vous souhaitez vous préparer.",
                    title: "Définissez un titre à votre préparation.",
                },
                title: "Préparer un discours",
            },
            notFound: {
               title: "Oops, on s'est perdu ?",
               buttonLabel: "Retour en sécurité"
            },
            old: {
                title: "Mes préparations",
            },
            dic: {
                title: "Dictionnaire généré",
            },
        },
        vocabulary: {
            empty: "Pas de vocabulaire génré pour le moment",
            filterLabel: "Colonne sur laquelle appliquer le filtre",
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
        },
    },
};
