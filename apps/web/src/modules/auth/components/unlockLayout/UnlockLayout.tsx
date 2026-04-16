import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiLock } from "react-icons/pi";

import { Button, Modal, SecureInput } from "@/components";

import { useAuth } from "../../context";

import "./unlockLayout.scss";

export const UnlockLayout = () => {
    const [isPending, setIsPending] = useState(false);
    const [password, setPassword] = useState("");

    const { isLocked, signout, unlock } = useAuth();
    const { t } = useTranslation();

    const onClick = async () => {
        if (password === "") {
            return
        }

        setIsPending(true);
        const isUnlocked = await unlock(password);
        setIsPending(false);

        if (!isUnlocked) {
            signout();
        }
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") onClick();
    };

    return (
        <Modal
            isOpen={isLocked}
            minWidth="680px"
            onClose={() => null}
            persistant
            width="50%"
        >
            <div className="unlock-layout">
                <div className="unlock-layout__header">
                    <PiLock size={20} />
                    <p>{t("auth.locked.title")}</p>
                </div>
                <p>{t("auth.locked.explanations")}</p>
                <SecureInput
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder="********"
                    value={password}
                />
                <Button
                    onClick={onClick}
                    isPending={isPending}
                >
                    {t("actions.confirm")}
                </Button>
            </div>
        </Modal>
    );
};
