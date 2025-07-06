import { ChangeEvent, KeyboardEvent, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "../styleLess";

import "./searchInput.scss";

type SearchInputProps = {
    readonly onSubmit: (searchValue: string) => void;
    readonly placeholder: string;
};
export const SearchInput = ({
    onSubmit,
    placeholder,
}: SearchInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { t } = useTranslation();

    const onBlur = () => setIsFocused(false);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
    const onClick = () => onSubmit(searchValue);
    const onFocus = () => setIsFocused(true);
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSubmit(searchValue);
    };

    return (
        <div className="search-input-container">
            <div className={`search-input ${isFocused ? "focused" : ""}`}>
                <div className="icon-container">
                    <MdSearch />
                </div>
                <InputStyleLess
                    onBlur={onBlur}
                    onChange={onChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    value={searchValue}
                />
            </div>
            <button onClick={onClick}>
                {t("actions.search")}
            </button>
        </div>
    );
};
