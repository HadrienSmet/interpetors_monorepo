import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlus } from "react-icons/pi";

import { Button, Input, LanguageSelect, Select } from "@/components";

import { EMPTY_WORKSPACE } from "../../utils";

import { WorkspaceLanguages } from "../languages";

import "./workspaceForm.scss";

export const WorkspaceForm = () => {
	const [isPending, setIsPending] = useState(false);
	const [workspace, setWorkspace] = useState(EMPTY_WORKSPACE);

	const { t } = useTranslation();

	const handleNative = (lng: string) => setWorkspace(state => ({
		...state,
		nativeLanguage: lng,
	}));
	const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkspace(state => ({
		...state,
		name: e.target.value,
	}));
	const onSubmit = () => {
		console.log({ workspace });
	}
	const pushLanguage = (lng: string) => setWorkspace(state => ({
		...state,
		languages: [...state.languages, lng],
	}));
	const removeLanguage = (lng: string) => setWorkspace(state => ({
		...state,
		languages: state.languages.filter(language => language !== lng),
	}));

	const languagesListProps = useMemo(() => ({
		handleNative,
		removeLanguage
	}), []);

	return (
		<div className="workspace-form__section">
			<div className="workspace-form">
				<div className="workspace-form__header">
					<h2>{t("workspaces.create.title")}</h2>
					<p>{t("workspaces.create.subtitle")}</p>
				</div>

				<div className="workspace-form__content">
					<div className="workspace-form__input">
						<label htmlFor="workspace-title">{t("workspaces.create.inputs.title.label")}</label>
						<Input
							id="workspace-title"
							onChange={handleTitle}
							placeholder={t("workspaces.create.inputs.title.placeholder")}
							value={workspace.name}
						/>
					</div>

					<div className="workspace-form__input">
						<label htmlFor="workspace-languages">{t("workspaces.create.inputs.languages.label")}</label>
						<LanguageSelect
							name="workspace-languages"
							onChange={pushLanguage}
						/>
						{workspace.languages.length > 0
							? <WorkspaceLanguages {...workspace} {...languagesListProps} />
							: (
								<div className="workspace-languages">
									<div>
										<PiPlus />
										<span>{t("workspaces.create.inputs.languages.more")}</span>
									</div>
								</div>
							)
						}
					</div>

					<div className="workspace-form__input">
						<label htmlFor="workspace_color-panels">{t("workspaces.create.inputs.colorPanels.label")}</label>
						<Select 
							id="workspace_color-panels"
							name="workspace_color-panels"
							onChange={() => null} 
							options={[{ label: "Default Color Panel", value: "fakeId" }]} 
						/>
					</div>

					<Button
						isPending={isPending}
						label={t("workspaces.new")}
						onClick={onSubmit}
					/>
				</div>
			</div>
		</div>
	);
};
