import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

import { toDeepLanguage, toLocale } from "../utils";

type TranslateToTargetParams = {
	readonly originLang: string;
	readonly targetLang: string;
	readonly text: string;
};
const translateToTarget = async ({ originLang, targetLang, text }: TranslateToTargetParams): Promise<string> => {
	const apiKey = process.env.DEEPL_API_KEY;
	const baseUrl = process.env.DEEPL_BASE_URL;
	if (!apiKey) throw new InternalServerErrorException("DEEPL_API_KEY is not configured.");
	if (!baseUrl) throw new InternalServerErrorException("DEEPL_BASE_URL is not configured.");

	const response = await fetch(
		`${baseUrl}/v2/translate`, 
		{
			method: "POST",
			headers: {
				Authorization: `DeepL-Auth-Key ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: [text],
				source_lang: originLang,
				target_lang: targetLang,
			}),
		}
	);

	if (!response.ok) {
		const errorBody = await response.text().catch(() => "");
		throw new InternalServerErrorException(`DeepL translation failed (${response.status}): ${errorBody}`);
	}

	const data = (await response.json()) as { translations?: Array<{ text?: string }>; };
	const translatedText = data.translations?.[0]?.text?.trim();
	if (!translatedText) throw new InternalServerErrorException("DeepL returned an empty translation.");

	return translatedText;
};
// TODO: use GoogleTranslate for those cases
const unsupportedLng = (lng: string, ctx: "origin" | "target") => `Unsupported ${ctx} language: ${lng}`;

type HandleTranslationParams = {
	readonly origin: string;
	readonly targets: Array<string>;
	readonly text: string;
};
export const handleTranslation = async ({ origin, targets, text }: HandleTranslationParams) => {
	const originLang = toDeepLanguage(origin);
	if (!originLang) throw new BadRequestException(unsupportedLng(origin, "origin"));

	const uniqueTargets = Array.from(
		new Set(
			targets
				.map(toLocale)
				.filter(Boolean)
				.filter((target) => target !== toLocale(origin))
		),
	);
	if (targets.length === 0 || uniqueTargets.length === 0) {
		throw new BadRequestException("There must be at least one targeted language to translate the text");
	}

	const translations = await Promise.all(
		uniqueTargets.map(async (target) => {
			const targetLang = toDeepLanguage(target);
			if (!targetLang) throw new BadRequestException(unsupportedLng(target, "target"));

			const translated = await translateToTarget({ text: text, targetLang, originLang });
			return [target, translated];
		}),
	);

	return Object.fromEntries(translations);
};
