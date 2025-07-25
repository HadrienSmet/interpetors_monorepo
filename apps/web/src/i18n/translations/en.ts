import { APP_NAME } from "@/constants";

export const en = {
    translation: {
        actions: {
            add: "Add",
            confirm: "Confirm",
            download: "Download",
            editOnDoubleClick: "Double click to edit",
            save: "Save",
            search: "Search",
            workspaces: {
                create: "Create work space",
            },
        },
        colorPanel: {
            creation: {
                action: "Create a color panel",
                title: "Color panel creation"
            },
            colors: {
                label: "Define the colors",
                placeholder: "Sources",
            },
            displayer: {
                color: "COLOR",
                name: "NAME",
            },
            title: {
                label: "Define a title",
                placeholder: "Default color panel",
            },
            missing: "No color panel found"
        },
        files: {
            "context-menu": {
                delete: "Delete the file",
                rename: "Rename the file",
            },
            editor: {
                "context-menu": {
                    highlight: "Highlight the selection",
                    note: "Create a note from selection",
                    underline: "Underline the selection",
                    vocabulary: "Add to vocabulary",
                },
                tools: {
                    backward: "Backward",
                    brush: "Brush",
                    close: "Close",
                    color: "Change color",
                    drag: "Drag",
                    forward: "Forward",
                    highlight: "Highlight",
                    horizontal: "Horizontal display",
                    note: "Add a note",
                    open: "Open",
                    underline: "Underline",
                    vertical: "Vertical display",
                    vocabulary: "Add to vocabulary",
                }
            }
        },
        folders: {
            "context-menu": {
                create: "Create new folder",
                delete: "Delete the folder",
                rename: "Rename the folder",
            },
            download: "Download the updated files",
            empty: "No files in this preparation",
        },
        inputs: {
            folders: {
                empty: "<default>Drag and drop you folder here</default><default>(files supported: pdf)</default>",
                unselected: "Select a file to see his content",
                unsupported: "Type of file not supported. Supported type of files: ",
            },
            notRequired: "Not required",
        },
        navigation: {
            buttons: {
                dictionary: "Dictionary",
                files: "Source folders",
                home: "My work space",
                preparations: "Old preparations",
                prepare: "New preparation",
                manager: "Manager",
                vocabulary: "Vocabulary",
            },
        },
        notes: {
            add: "Add a note",
            groupHeader_one: "<default><strong>{{count}}</strong> created note</default>",
            groupHeader_other: "<default><strong>{{count}}</strong> created notes</default>",
            navigate: "Navigate to note",
            placeholder: "Fill the note",
            readOnClick: "Click to see the whole note.",
        },
        onBoarding: {
            title: `<default>Welcome on <title>${APP_NAME}</title></default`,
            subtitle: "The professional tool to work with languages",
        },
        onConstruction: "Servers under construction",
        views: {
            home: {
                title: "My work space",
                sections: {
                    languages: "Languages",
                    colorPanel: "Color panel",
                },
            },
            new: {
                buttons: {
                    downloadFiles: "Download the files",
                    downloadVocabulary: "Download the vocabulary",
                    save: "Save the preparation",
                },
                title: "Define a title for this preparation",
            },
            notFound: {
                title: "Oops, someone got lost?",
                buttonLabel: "Back to safety"
            },
            old: {
                title: "My preparations",
            },
            dic: {
                title: "Vocabulary generated by my preparations",
            },
        },
        vocabulary: {
            empty: "No vocabulary generated yet",
            filterLabel: "Column on wich to apply the filter",
            placeholders: {
                cell: "Translate {{ word }} ({{ language }})",
                search: "Search in the generated vocabulary",
            },
            sources: "Sources",
        },
        workspaces: {
            create: {
                title: "Create your custom workspace",
                inputs: {
                    title: {
                        label: "Define a title for your work space.",
                        errorMessages: {
                            length: "Title length must be between 3 and 45 characters.",
                        },
                    },
                    "work-languages": {
                        label: "Define the languages you are working with.",
                        errorMessages: {
                            length: "Select at least two languages.",
                        },
                    },
                    "native-language": {
                        label: "Pick one of those to define your native language.",
                    },
                },
            }
        }
    },
};
