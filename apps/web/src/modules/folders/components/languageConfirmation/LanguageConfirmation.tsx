import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, LanguageSelect, Modal } from "@/components";
import { usePdfCanvas, usePdfTools } from "@/modules/pdf";
import { useWorkspaces } from "@/modules/workspace";

import "./languageConfirmation.scss";

export const LanguageConfirmation = () => {
	const { clearDrawer } = usePdfCanvas();
	const { cancelVocabularyCreation, currentRange, languageToConfirm, setLanguageToConfirm, setLanguageToUse } = usePdfTools();
	const { t } = useTranslation();
	const { currentWorkspace } = useWorkspaces();
	
	const [selectedLanguage, setSelectedLanguage] = useState(languageToConfirm);

	const cancel = () => {
		clearDrawer();
		cancelVocabularyCreation();
	};
	const confirm = () => {
		setLanguageToUse(selectedLanguage);
		setLanguageToConfirm(undefined);
	};

	const recommandedItems: Array<string> = useMemo(() => {
		if (!currentWorkspace || !languageToConfirm) {
			return ([]);
		}
		const others = [...currentWorkspace.languages].filter(el => el === languageToConfirm);

		return ([languageToConfirm, ...others]);
	},[languageToConfirm, currentWorkspace?.languages]);

	useEffect(() => {
		setSelectedLanguage(languageToConfirm);
	}, [languageToConfirm]);

	return (
		<Modal
			isOpen={languageToConfirm !== undefined}
			onClose={() => null}
			persistant
			width="40%"
		>
			<div className="language-confirmation">
				<h3>{t("vocabulary.confirmation", { expression: currentRange?.toString().trim() })}</h3>
				
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

				<div className="language-confirmation__actions">			
					<Button onClick={cancel}>{t("actions.cancel")}</Button>
					<Button onClick={confirm}>{t("actions.translate")}</Button>
				</div>
			</div>
		</Modal>
	);
};
