import Fawn from "fawn";
import mongoose, { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class TransactionService implements OnModuleInit {
    constructor(@InjectConnection() private connection: Connection) {}

    onModuleInit() {
        Fawn.init();
    }
}
