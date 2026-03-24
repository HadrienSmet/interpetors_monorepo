import { Injectable } from "@nestjs/common";

import { TranslateDto } from "./dto";

@Injectable()
export class TranslateService {
	constructor() {}

	async translate(dto: TranslateDto) {

		const output = {};

		for (const target of dto.targets) {
			output[target] = `${dto.text} in ${target}`;
		}

		return (output);
	}
}
