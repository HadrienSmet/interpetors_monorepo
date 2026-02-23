import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UploadChunkDto {
	@IsString()
	@IsNotEmpty()
	chunkB64: string;
	@IsString()
	@IsNotEmpty()
	checksum: string;
	@IsString()
	encoding: "gzip";
	@IsNumber()
	index: string;
	@IsNumber()
	total: number;
	@IsString()
	@IsNotEmpty()
	uploadId: string;
}
