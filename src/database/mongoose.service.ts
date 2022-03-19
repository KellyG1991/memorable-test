import { ConfigService } from "@nestjs/config";
import autopopulate from "mongoose-autopopulate";
import { Injectable, Scope } from "@nestjs/common";
import { MongooseOptionsFactory, MongooseModuleOptions } from "./utils/options";

/**
 * MongooseService
 * @class
 */
@Injectable({ scope: Scope.TRANSIENT })
export class MongooseConfigService implements MongooseOptionsFactory {
    /**
     * Mongoose configuration Service.
     * @constructor
     * @param {ConfigService} configService Configuration service
     */
    constructor(
        /** @readonly */
        private readonly configService: ConfigService
    ) { }

    /**
     * Creates mongoose configuration/connection object.
     * @returns {MongooseModuleOptions}
     */
    createMongooseOptions(): MongooseModuleOptions {
        // We create a new configuration...
        const config = {
            uri: this.configService.get('database.connections.mongodb.uri'),
            ...this.configService.get('database.connections.mongodb.config'),
        };

        // Clean up configuration...
        for (const key in config) {
            if (~[undefined, ''].indexOf(config[key])) {
                delete config[key];
            }
        }

        config.connectionFactory = (connection) => {
            connection.plugin(autopopulate);
            return connection;
        };

        // Return configuration...
        return config;
    }
}
