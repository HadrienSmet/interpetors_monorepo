import { PiX } from "react-icons/pi";

import { capitalize, getNativeName } from "@/utils";

type WorkspaceLanguagesProps = {
	readonly handleNative?: (lng: string) => void;
	readonly languages: Array<string>;
	readonly nativeLanguage: string;
	readonly removeLanguage?: (lng: string) => void;
};
export const WorkspaceLanguages = ({ 
	handleNative, 
	languages, 
	nativeLanguage, 
	removeLanguage, 
}: WorkspaceLanguagesProps) => (
	<div className="workspace-languages">
		{languages.map(language => (
			<div
				className={`language ${nativeLanguage === language ? "native" : ""} ${handleNative ? "editing" : ""}`}
				onClick={handleNative
					? () => handleNative(language)
					: () => null
				}
				key={language}
			>
				<p>{capitalize(getNativeName(language) ?? "")}</p>
				{removeLanguage && (
					<PiX onClick={(e) => {
						e.stopPropagation();
						removeLanguage(language);
					}} />
				)}
			</div>
		))}
	</div>
);
