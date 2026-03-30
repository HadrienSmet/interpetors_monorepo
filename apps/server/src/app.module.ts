import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import {
    AuthModule,
    ColorPanelModule,
    FilesModule,
    NotesModule,
    PreparationsModule,
    PresignModule,
    PrismaModule,
    PrismaService,
	TranslateModule,
    UserModule,
    VocabularyModule,
    WorkspaceModule,
} from "./modules";

@Module({
    imports: [
        AuthModule,
        ColorPanelModule,
        ConfigModule.forRoot(),
        FilesModule,
        NotesModule,
        PreparationsModule,
        PresignModule,
        PrismaModule,
        UserModule,
		TranslateModule,
        VocabularyModule,
        WorkspaceModule,
    ],
    providers: [PrismaService],
})
export class AppModule { }
