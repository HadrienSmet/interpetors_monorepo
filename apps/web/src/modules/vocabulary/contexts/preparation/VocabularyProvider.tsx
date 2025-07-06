import { PropsWithChildren, useState } from "react";

import { PdfVocabulary } from "@/modules/folders";

import { PreparationVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, PreparationVocabularyContext } from "./VocabularyContext";

const MOCK = {"list":{"rgb(51, 255, 0)":{"voluptates":{"color":"rgb(51, 255, 0)","id":"voluptates","occurence":{"color":"rgb(51, 255, 0)","id":"voluptates","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"voluptates"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"voluptates"},"translations":{"catalan":"sliretuh peorug ","albanais":"rtg ","assamais":"rtmgmhu zermt "}},"ecessitatibus":{"color":"rgb(51, 255, 0)","id":"ecessitatibus","occurence":{"color":"rgb(51, 255, 0)","id":"ecessitatibus","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"ecessitatibus"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"ecessitatibus"},"translations":{"catalan":"beruhig","albanais":"ritgu ","assamais":"semrog"}},"temporibus":{"color":"rgb(51, 255, 0)","id":"temporibus","occurence":{"color":"rgb(51, 255, 0)","id":"temporibus","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"temporibus"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"temporibus"},"translations":{"catalan":"kjdrt","albanais":"drtlih","assamais":"fklgj rsmt"}},"evidences":{"color":"rgb(51, 255, 0)","id":"evidences","occurence":{"color":"rgb(51, 255, 0)","id":"evidences","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"evidences"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"evidences"},"translations":{"catalan":"ilft","albanais":"zeryyh","assamais":"poipoi"}}},"rgb(255, 32, 30)":{"eating":{"color":"rgb(255, 32, 30)","id":"eating","occurence":{"color":"rgb(255, 32, 30)","id":"eating","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"eating"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"eating"},"translations":{"catalan":"Manger","albanais":"rtmh","assamais":"dlthaze"}},"chickens":{"color":"rgb(255, 32, 30)","id":"chickens","occurence":{"color":"rgb(255, 32, 30)","id":"chickens","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"chickens"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"chickens"},"translations":{"catalan":"Poulet","albanais":"Bbq","assamais":"zzrmetkgh"}},"accusamus":{"color":"rgb(255, 32, 30)","id":"accusamus","occurence":{"color":"rgb(255, 32, 30)","id":"accusamus","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"accusamus"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"accusamus"},"translations":{"catalan":"eartg","albanais":"fyuj","assamais":"fcghcvh"}},"itaque":{"color":"rgb(255, 32, 30)","id":"itaque","occurence":{"color":"rgb(255, 32, 30)","id":"itaque","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"itaque"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"itaque"},"translations":{"catalan":"zriumth","albanais":"xcfbkcu","assamais":"liugo"}}},"rgb(0, 51, 255)":{"quibusdam":{"color":"rgb(0, 51, 255)","id":"quibusdam","occurence":{"color":"rgb(0, 51, 255)","id":"quibusdam","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"quibusdam"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"quibusdam"},"translations":{"catalan":"druht roti ro","albanais":"ezrmogijezr","assamais":"moizerjhfmielhrf"}},"blanditiis":{"color":"rgb(0, 51, 255)","id":"blanditiis","occurence":{"color":"rgb(0, 51, 255)","id":"blanditiis","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"blanditiis"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"blanditiis"},"translations":{"catalan":"ezriltuh","albanais":"srthrsth","assamais":"dtyjetyjrtt"}},"ssumenda":{"color":"rgb(0, 51, 255)","id":"ssumenda","occurence":{"color":"rgb(0, 51, 255)","id":"ssumenda","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"ssumenda"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"ssumenda"},"translations":{"catalan":"slkfgjbsd","albanais":"strmkuh","assamais":"esrùgija"}},"architecto":{"color":"rgb(0, 51, 255)","id":"architecto","occurence":{"color":"rgb(0, 51, 255)","id":"architecto","occurence":{"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"architecto"},"translations":{},"filePath":"test_folder/mocked_subject.pdf","pageIndex":1,"text":"architecto"},"translations":{"catalan":"sierug ","albanais":"erklguh ","assamais":"erzetfser"}}}}}

export const PreparationVocabularyProvider = ({ children }: PropsWithChildren) => {
    const [vocabulary, setVocabulary] = useState<PreparationVocabulary>(MOCK.list);

    const addToVocabulary = (word: WordToAdd) => {
        // TODO two methods vocToId & idToVoc
        const wordAsId = word.text.split(" ").join("-");

        if (word.color in vocabulary && wordAsId in vocabulary[word.color]) {
            return;
        }

        setVocabulary(state => {
            const copy = { ...state };

            if (!(word.color in copy)) {
                copy[word.color] = {};
            }

            copy[word.color][wordAsId] = {
                color: word.color,
                id: wordAsId,
                occurence: { ...word },
                translations: {},
            };

            return (copy);
        });
    };
    const addTranslation = (params: AddTranslationParams) => setVocabulary(state => {
        const copy = { ...state };

        if (
            params.color in copy &&
            params.id in copy[params.color]
        ) {
            copy[params.color][params.id].translations[params.locale] = params.translation
        }

        return (copy);
    });
    const remove = (color: string, id: string) => setVocabulary(state => {
        const copy = { ...state };

        delete copy[color][id];

        return (copy);
    });
    const update = (color: string, id: string, item: PdfVocabulary) => setVocabulary(state => {
        const copy = { ...state };

        const updated = {
            ...copy[color][id],
            ...item,
            color,
            id,
        };

        return ({
            ...copy,
            [color]: {
                ...copy[color],
                [id]: updated,
            },
        });
    });

    const value = {
        vocabulary,

        addTranslation,
        addToVocabulary,
        remove,
        update,
    };

    return (
        <PreparationVocabularyContext.Provider value={value}>
            {children}
        </PreparationVocabularyContext.Provider>
    );
};
