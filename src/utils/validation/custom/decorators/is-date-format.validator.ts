import { ValidationOptions, registerDecorator } from "class-validator";
import { DateFormatValidator } from "../constraints/date-format.constraint";

/**
 * IsDateFormat decorators
 * @param {string} constraint Constraint
 * @param {ValidationOptions} validationOptions ValidationOptions
 * @returns {Function}
 */
export function IsDateFormat(constraint: Readonly<string>, validationOptions?: ValidationOptions) {
    return function (target: any, propertyName: string) {
        registerDecorator({
            target: target.constructor,
            propertyName,
            options: validationOptions,
            constraints: [constraint],
            validator: DateFormatValidator,
        });
    };
}
