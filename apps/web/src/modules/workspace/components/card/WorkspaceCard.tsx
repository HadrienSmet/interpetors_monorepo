import { ChangeEvent, useMemo, useState } from "react";
import { PiCheck, PiPencil, PiTrash } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { Button, InputStyleLess, LanguageSelect } from "@/components";
import { useColorPanel } from "@/modules/colorPanel";

import { useWorkspaces } from "../../context";
import { Workspace } from "../../types";

import { WorkspaceLanguages } from "../languages";

import "./workspaceCard.scss";

const ACTION_ICON_SIZE = 16 as const;

type WorkspaceCardProps = {
	readonly editingItem: string | undefined;
	readonly setEditingItem: (id: string | undefined) => void;
	readonly workspace: Workspace;
};
type WorkspaceCardContentProps = 
	& WorkspaceCardProps
	& {
		readonly handleNative: (lng: string) => void;
		readonly isCurrent: boolean;
		readonly pushLanguage: (lng: string) => void;
		readonly removeLanguage: (lng: string) => void;
	};
const WorkspaceCardContent = ({ 
	editingItem, 
	handleNative, 
	pushLanguage, 
	removeLanguage, 
	setEditingItem, 
	workspace,
}: WorkspaceCardContentProps) => {
	const [isPending, setIsPending] = useState(false);

	const { colorPanel } = useColorPanel();
	const { t } = useTranslation();
	const { 
		currentWorkspace, 
		changeWorkspace, 
		removeWorkspace, 
		updateWorkspace, 
		workspaces, 
	} = useWorkspaces();

	// TODO: Loader here
	const remove = () => removeWorkspace(workspace.id);

	const onSubmit = async () => {
		setIsPending(true);
		await updateWorkspace({
			body: workspace,
			id: workspace.id,
		});
		setIsPending(false);
		setEditingItem(undefined);
	};
	const toggleEdit = () => {
		if (editingItem === workspace.id) {
			setEditingItem(undefined);
			return;
		}

		setEditingItem(workspace.id);
	};
	const isEditing = useMemo(() => (editingItem === workspace.id), [editingItem, workspace.id]);
	const languagesListProps = useMemo(() => (
		isEditing
			? ({
				handleNative,
				removeLanguage
			})
			: {}
	), [editingItem, workspace.id]);
	const isCurrent = workspace.id === currentWorkspace?.id;

	return (
		<div className="workspace-card">
			<div className="workspace-data">
				{isEditing && (
					<LanguageSelect
						name="workspace-languages"
						onChange={pushLanguage}
					/>
				)}
				<WorkspaceLanguages
					{...workspace}
					{...languagesListProps}
				/>
				<div className="workspace-stats">
					{workspace.colorPanelId && (
						<p>{t("colorPanel.used", { name: colorPanel?.name })}</p>
					)}
					<p>{t("workspaces.stats.preparation", { count: workspace._count.preparations })}</p>
					<p>{t("workspaces.stats.vocabulary", { count: workspace._count.vocabularyTerms })}</p>
				</div>
				{isEditing && (
					<Button
						isPending={isPending}
						label={t("actions.update")}
						onClick={onSubmit}
					/>
				)}
			</div>
			<div className="workspace-actions">
				<button
					className={`workspace-selector ${isCurrent ? "active" : ""}`}
					disabled={isCurrent}
					onClick={() => changeWorkspace(workspace.id)}
					title={t(`workspaces.selector.${isCurrent ? "selected" : "unselected"}`)}
				>
					<PiCheck size={ACTION_ICON_SIZE} />
				</button>
				<button 
					onClick={toggleEdit}
					title={t("actions.edit")}
				>
					<PiPencil size={ACTION_ICON_SIZE} />
				</button>
				<button
					disabled={Object.keys(workspaces).length < 2}
					onClick={remove}
					title={t("actions.delete")}
				>
					<PiTrash size={ACTION_ICON_SIZE} />
				</button>
			</div>
		</div>
	);
};

export const WorkspaceCard = ({ editingItem, setEditingItem, ...props }: WorkspaceCardProps) => {
	const [workspace, setWorkspace] = useState({ ...props.workspace });

	const { currentWorkspace } = useWorkspaces();

	const handleNative = (lng: string) => setWorkspace(state => ({
		...state,
		nativeLanguage: lng,
	}));
	const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkspace(state => ({
		...state,
		name: e.target.value,
	}));
	const pushLanguage = (lng: string) => setWorkspace(state => ({
		...state,
		languages: [...state.languages, lng],
	}));
	const removeLanguage = (lng: string) => setWorkspace(state => ({
		...state,
		languages: state.languages.filter(language => language !== lng),
	}));

	const isCurrent = workspace.id === currentWorkspace?.id;

	return ({
		content: (
			<WorkspaceCardContent
				key={workspace.id}
				editingItem={editingItem}
				handleNative={handleNative}
				isCurrent={isCurrent}
				pushLanguage={pushLanguage}
				removeLanguage={removeLanguage}
				setEditingItem={setEditingItem}
				workspace={workspace}
			/>
		),
		title: editingItem === workspace.id
			? (
				<InputStyleLess
					onChange={handleTitle}
					value={workspace.name}
				/>
			)
			: (<p>{workspace.name} {isCurrent && <PiCheck />}</p>)
	});
};
