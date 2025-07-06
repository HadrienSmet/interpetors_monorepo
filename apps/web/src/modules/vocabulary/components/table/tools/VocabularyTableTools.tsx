import { useEffect, useState } from "react";
import { MdDownload, MdSearch } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { DraggableSection, SearchInput, useDraggableSection } from "@/components";
import { useWorkSpaces } from "@/contexts";

import { useVocabularyTable } from "../../../contexts";

import "./vocabularyTableTools.scss";

type VocabularyTableFilterColumnProps = {
    readonly id: string;
};
const VocabularyTableFilterColumn = ({ id }: VocabularyTableFilterColumnProps) => {
    const { searchingColumn, setSearchingColumn } = useVocabularyTable();

    const onClick = () => setSearchingColumn(id);

    return (
        <button
            className={`vocabulary-table-filter-column ${searchingColumn === id ? "selected" : ""}`}
            onClick={onClick}
        >
            {id}
        </button>
    );
};

type VocabularyTableFilterProps = {
    readonly closeSearch: () => void;
};
const VocabularyTableFilter = ({ closeSearch }: VocabularyTableFilterProps) => {
    const { t } = useTranslation();
    const { setSearchValue } = useVocabularyTable();
    const { currentWorkSpace } = useWorkSpaces();

    const { native, work } = currentWorkSpace!.languages;

    const onSubmit = (value: string) => {
        setSearchValue(value);
        closeSearch();
    };

    return (
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
    );
};
const VocabularyTableToolsChild = () => {
    const [isSearching, setIsSearching] = useState(false);
    const { dynamicClass, isLeftSide, isOpen, isTopSide } = useDraggableSection();

    const closeSearch = () => setIsSearching(false);
    // TODO implement download
    const download = () => console.log("Should download");
    const toggleSearch = () => setIsSearching(state => !state);

    useEffect(() => {
        if (!isOpen) {
            closeSearch();
        }
    }, [isOpen]);

    return (
        <div className={`vocabulary-table-tools-container ${dynamicClass}`}>
            <div className={`vocabulary-table-tools ${dynamicClass} ${isLeftSide ? "left" : "right"} ${isTopSide ? "top" : "bot"}`}>
                <button
                    className="vocabulary-table-tool"
                    onClick={toggleSearch}
                >
                    <MdSearch />
                </button>
                <button
                    className="vocabulary-table-tool"
                    onClick={download}
                    >
                    <MdDownload />
                </button>
            </div>
            <div className={`vocabulary-table-filter-container ${isSearching ? "expanded" : ""}`}>
                <VocabularyTableFilter closeSearch={closeSearch} />
            </div>
        </div>
    );
};
export const VocabularyTableTools = () => {

    return (
        <DraggableSection
            expansionEnabled
            rotateEnabled
        >
            <VocabularyTableToolsChild />
        </DraggableSection>
    );
};
