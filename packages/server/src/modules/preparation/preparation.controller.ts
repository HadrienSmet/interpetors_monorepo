// import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";

// import { JwtAuthGuard } from "src/common";

// import { CreatePreparationDto } from "./dto";
// import { PreparationService } from "./preparation.service";


// @Controller("preparations")
// @UseGuards(JwtAuthGuard)
// export class PreparationController {
//     constructor(private readonly preparationService: PreparationService) { }


//     @Post()
//     create(@Body() dto: CreatePreparationDto, @Req() req: any) {
//         return this.preparationService.create(req.user.sub, dto);
//     }
// }

// __________________________________________________________________________________
// __________________________________________________________________________________

// import { Body, Controller, Param, Post } from "@nestjs/common";
// import { CreatePreparationDto } from "./dto";
// import { PreparationsService } from "./preparations.service";

// @Controller("workspaces/:workspaceId/preparations")
// export class PreparationsController {
//   constructor(private readonly service: PreparationsService) {}

//   @Post()
//   async create(
//     @Param("workspaceId") workspaceId: string,
//     @Body() dto: CreatePreparationDto,
//   ) {
//     return this.service.createFromClientPayload(workspaceId, dto.params);
//   }
// }
