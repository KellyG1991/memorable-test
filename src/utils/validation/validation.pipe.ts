import {
    Injectable,
    ValidationPipe,
    ArgumentMetadata,
    ValidationPipeOptions,
} from '@nestjs/common';
import { ObjectType } from '../types';
import { ConfigService } from '@nestjs/config';

/**
 * CustomValidationPipe
 * @class
 * @extends {ValidationPipe}
 */
@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    /**
     * Custom validation pipe constructor.
     * @param {ConfigService} configService ConfigService
     */
    constructor(private readonly configService: ConfigService) {
        super(configService.get('app.validation') as ValidationPipeOptions);
    }

    /**
     * Custom Transformer.
     * @param {ObjectType} value Value
     * @param {ArgumentMetadata} metadata ArgumentMetadata
     * @returns {any}
     */
    async transform(value: ObjectType, metadata: ArgumentMetadata): Promise<any> {
        return await super.transform(value, metadata);
    }
}
