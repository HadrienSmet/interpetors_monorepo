import { PrismaClient } from "@prisma/client";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Helper to reset DB during tests
    cleanDatabase() {
        return this.$transaction([
            this.user.deleteMany(),
            // add other resources to clean here
        ]);
    }
}
