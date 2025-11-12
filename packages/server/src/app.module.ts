import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import {
    AuthModule,
    ColorPanelModule,
    FileActionsModule,
    FilesModule,
    NotesModule,
    PreparationsModule,
    PresignModule,
    PrismaModule,
    PrismaService,
    UserModule,
    VocabularyModule,
    WorkspaceModule,
} from "./modules";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot(),
        FileActionsModule,
        FilesModule,
        NotesModule,
        PreparationsModule,
        PresignModule,
        UserModule,
        VocabularyModule,
        WorkspaceModule,
        ColorPanelModule,
        PrismaModule
    ],
    providers: [PrismaService],
})
export class AppModule { }
