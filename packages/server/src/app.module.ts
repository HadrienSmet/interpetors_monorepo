import { Module } from "@nestjs/common";

import {
    AuthModule,
    ColorPanelModule,
    FileModule,
    NotesModule,
    PreparationModule,
    PrismaModule,
    PrismaService,
    UserModule,
    VocabularyModule,
    WorkspaceModule,
} from "./modules";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot(),
        FileModule,
        NotesModule,
        PreparationModule,
        UserModule,
        VocabularyModule,
        WorkspaceModule,
        ColorPanelModule,
        PrismaModule
    ],
    providers: [PrismaService],
})
export class AppModule { }
