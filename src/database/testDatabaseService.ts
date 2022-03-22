import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TestDatabaseService {
    constructor(
        @InjectConnection()
        private readonly connection: Connection,
    ) {}

    getHandle(): Connection {
        return this.connection;
    }
}
