import { BadRequestException, Injectable } from "@nestjs/common";

import { DEEP_L } from "./deepL";
import { TranslateDto } from "./dto";

@Injectable()
export class TranslateService {
	constructor() {}

	async translate(dto: TranslateDto) {
		const text = dto.text.trim();
		if (!text) throw new BadRequestException("Text cannot be empty.");

		return DEEP_L.handleTranslation(dto);
	}
}
