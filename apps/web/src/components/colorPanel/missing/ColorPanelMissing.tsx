import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import { Button, Modal } from "@/components";
import { ColorPanel, useColorPanels, useWorkSpaces } from "@/contexts";

import { ColorPanelForm } from "../form";

import "./colorPanelMissing.scss";

export const ColorPanelMissing = () => {
    const [isCreating, setIsCreating] = useState(false);

    const { createPanel } = useColorPanels();
    const { t } = useTranslation();
    const { currentWorkSpace, editWorkSpace } = useWorkSpaces();

    const close = () => setIsCreating(false);
    const open = () => setIsCreating(true);
    const submit = (colorsRecord: Omit<ColorPanel, "id">) => {
        // TODO BACKEND
        const id = uuidv4();

        createPanel({ ...colorsRecord, id });
        editWorkSpace({ ...currentWorkSpace!, colorPanel: id });
        close();
    };

    return (
        <div className="color-panel-missing">
            <p>{t("colorPanel.missing")}</p>
            <Button
                label={t("colorPanel.creation.action")}
                onClick={open}
            />
            <Modal
                isOpen={isCreating}
                onClose={close}
                width="60%"
            >
                <ColorPanelForm
                    isOpen={isCreating}
                    onSubmit={submit}
                />
            </Modal>
        </div>
    );
};
