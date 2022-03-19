import { Module } from '@nestjs/common';
import database from './config/database';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose.service';

@Module({
    imports: [
        ConfigModule.forFeature(database),
        MongooseModule.forRootAsync({
            useClass: MongooseConfigService,
        })
    ],
})
export class DatabaseModule {}
