import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { ModuleRef } from "@nestjs/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { MomentService } from "../../../moment/moment.service";

/**
 * DateFormatValidator
 * @class
 * @private @property {MomentService} momentService
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'isDateFormat' })
export class DateFormatValidator implements
    ValidatorConstraintInterface, OnModuleInit {
    /** MomentService */
    private momentService: MomentService;

    /**
     * Date format validator constructor
     * @constructor
     * @param {ModuleRef} moduleRef Module Reference
     */
    constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        this.momentService = await this.moduleRef.resolve(MomentService);
    }

    /**
     * Validate function
     * @param {string} value Input value
     * @param {ValidationArguments} args Validation Arguments
     * @return <boolean>
     */
    validate(
        value: string,
        args: ValidationArguments & { constraints: Readonly<[string]> }
    ): boolean {
        const format = args.constraints[0];

        return this.momentService.moment(value, format).isValid();
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} doesn't match format ${args.constraints[0]}`;
    }
}
