import { Module } from '@nestjs/common';
import { GroupsModule } from './groups/groups.module';
import { PrismaModule } from 'nestjs-prisma';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { ReplacementsModule } from './replacements/replacements.module';

@Module({
  imports: [
    GroupsModule,
    SchedulesModule,
    AuthModule,
    ReplacementsModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
