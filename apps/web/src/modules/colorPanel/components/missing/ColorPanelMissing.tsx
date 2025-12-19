import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Modal } from "@/components";

import { useColorPanel } from "../../contexts";
import { ColorPanelInCreation } from "../../types";

import { ColorPanelForm } from "../form";

import "./colorPanelMissing.scss";

export const ColorPanelMissing = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const { createPanel } = useColorPanel();
    const { t } = useTranslation();

    const close = () => setIsCreating(false);
    const open = () => setIsCreating(true);
    const submit = async (colorsRecord: ColorPanelInCreation) => {
        setIsPending(true);
        await createPanel({ ...colorsRecord, name: colorsRecord.name ?? "Default" });
        setIsPending(false);
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
                width="75%"
            >
                <ColorPanelForm
                    isOpen={isCreating}
                    isPending={isPending}
                    onSubmit={submit}
                />
            </Modal>
        </div>
    );
};
