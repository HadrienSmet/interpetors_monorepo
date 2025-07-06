import { MdDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { SearchInput } from "@/components";
import { useWorkSpaces } from "@/contexts";

import { useVocabularyTable } from "../../../contexts";

import "./vocabularyTableTools.scss";

const VocabularyTableFilterColumn = ({ id }: { id: string }) => {
    const { searchingColumn, setSearchingColumn } = useVocabularyTable();

    const onClick = () => setSearchingColumn(id)

    return (
        <button
            className={`vocabulary-table-filter-column ${searchingColumn === id ? "selected" : ""}`}
            onClick={onClick}
        >
            {id}
        </button>
    );
};

export const VocabularyTableTools = () => {
    const { t } = useTranslation();
    const { list, setSearchValue } = useVocabularyTable();
    const { currentWorkSpace } = useWorkSpaces();

    const { native, work } = currentWorkSpace!.languages;

    const onSubmit = (value: string) => setSearchValue(value);

    return (
        <div className="vocabulary-table-tools">
            <div className="vocabulary-table-filter">
                <div className="vocabulary-table-filter-header">
                    <p>{t("vocabulary.filterLabel")}</p>
                    <div className="vocabulary-table-filter-columns">
                        <VocabularyTableFilterColumn id="sources" />
                        <VocabularyTableFilterColumn id={native} />
                        {work
                            .filter(lng => lng !== native)
                            .map(lng => (<VocabularyTableFilterColumn id={lng} />))
                        }
                    </div>
                </div>
                <SearchInput
                    onSubmit={onSubmit}
                    placeholder={t("vocabulary.placeholders.search")}
                />
            </div>
                <button
                    className="vocabulary-table-download"
                    disabled={Object.keys(list).length === 0}
                >
                    <span>{t("actions.download")}</span>
                    <MdDownload />
                </button>
        </div>
    );
};
