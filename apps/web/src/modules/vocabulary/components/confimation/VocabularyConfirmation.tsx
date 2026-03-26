import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Input, LanguageSelect, Modal } from "@/components";
import { useLocale } from "@/hooks";
import { usePdfCanvas, usePdfTools } from "@/modules/pdf";
import { useWorkspaces } from "@/modules/workspace";

import { FORBIDDEN_CHAR, hasBackToLine, hasForbiddenChar, hasTooMuchWords, isTooLong, LIMITS } from "./conditions";
import { normalizeVocabulary } from "./normalize";
import "./vocabularyConfirmation.scss";

export const VocabularyConfirmation = () => {
	const [errorMessages, setErrorMessages] = useState<Array<string>>([]);
	const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
	const [selectedText, setSelectedText] = useState<string | undefined>(undefined);
	const [selectionError, setSelectionError] = useState<string | undefined>(undefined);

	const { locale } = useLocale();
	const { clearDrawer } = usePdfCanvas();
	const { 
		cancelVocabularyCreation, 
		currentRange, 
		languageToConfirm, 
		setLanguageToConfirm, 
		setLanguageToUse, 
		updateVocabularyRangeFromText,
	} = usePdfTools();
	const { t } = useTranslation();
	const { currentWorkspace } = useWorkspaces();
	
	const cancel = () => {
		clearDrawer();
		cancelVocabularyCreation();
	};
	const confirm = () => {
		setLanguageToUse(selectedLanguage);
		setLanguageToConfirm(undefined);
	};
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;

		setSelectedText(nextValue);

		// Texte vide = on laisse la validation métier gérer
		if (!nextValue.trim()) {
			setSelectionError(undefined);
			return;
		}

		const didUpdateRange = updateVocabularyRangeFromText(nextValue);
		if (!didUpdateRange) {
			setSelectionError(t("vocabulary.conditions.sourceMismatch"));
			return;
		}

		setSelectionError(undefined);
	};

	const recommandedItems: Array<string> = useMemo(() => {
		if (!currentWorkspace || !languageToConfirm) {
			return ([]);
		}

		const others = [...currentWorkspace.languages].filter(el => el !== languageToConfirm);

		return ([languageToConfirm, ...others]);
	},[languageToConfirm, currentWorkspace?.languages]);

	useEffect(() => {
		setSelectedLanguage(languageToConfirm);
	}, [languageToConfirm]);
	useEffect(() => {
		setSelectedText(currentRange?.toString().trim());
	}, [currentRange]);
	useEffect(() => {
		if (!selectedText) {
			return;
		}

		const normalized = normalizeVocabulary(selectedText);
		const errors = [];
		if (hasBackToLine(normalized)) {
			errors.push(t("vocabulary.conditions.backToLine"));
		}
		if (hasForbiddenChar(normalized)) {
			errors.push(t("vocabulary.conditions.punctuation", { list: FORBIDDEN_CHAR.map(char => `"${char}"`).join(", ") }));
		}
		if (hasTooMuchWords(normalized)) {
			errors.push(t("vocabulary.conditions.words", { max: LIMITS.words }));
		}
		if (isTooLong(normalized)) {
			errors.push(t("vocabulary.conditions.length", { max: LIMITS.length }));
		}

		setErrorMessages(errors);
	}, [locale, selectedText]);

	return (
		<Modal
			isOpen={languageToConfirm !== undefined}
			onClose={() => null}
			persistant
			width="40%"
		>
			<div className="vocabulary-confirmation">
				<h3>{t("vocabulary.confirmation")}</h3>

				<div className="vocabulary-input">
					<label htmlFor="vocabulary-expression">
						{t("vocabulary.expression")}
					</label>
					<Input
						className="input"
						id="vocabulary-expression"
						onChange={onChange}
						value={selectedText}
					/>
					{errorMessages.length > 0 && (
						<div className="vocabulary-conditions">
							<p>{t("vocabulary.conditions.title")}</p>
							<ul>
								{errorMessages.map((msg, index) => (
									<li key={index}>- {msg}</li>
								))}
							</ul>
						</div>
					)}
					{selectionError && (
						<div className="vocabulary-conditions">
							<p>{selectionError}</p>
						</div>
					)}
				</div>
				
				<div className="vocabulary-input">
					<label htmlFor="vocabulary-language">
						{t("vocabulary.origin")}
					</label>
					<LanguageSelect
						id="vocabulary-language"
						name="vocabulary-language"
						onChange={(val) => setSelectedLanguage(val)}
						recommandedItems={recommandedItems}
						value={selectedLanguage}
					/>
				</div>

				<div className="vocabulary-actions">			
					<Button onClick={cancel}>{t("actions.cancel")}</Button>
					<Button 
						disabled={errorMessages.length > 0 || selectionError !== undefined}
						onClick={confirm}
					>
						{t("actions.translate")}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
