import { iterate } from "iterare";
import { ValidationError } from "class-validator";
import { UnprocessableEntityException, HttpException } from "@nestjs/common";

/**
 * Prepend constraint with parent key.
 * @param parentError ValidationError
 * @param error ValidationError
 * @returns {ValidaitonError}
 */
function prependConstraintsWithParentProp(
    parentError: ValidationError,
    error: ValidationError,
): ValidationError {
    error.property = `${parentError.property}.${error.property}`;
    return error;
}

/**
 * Map chiildren to validation errors.
 * @param error ValidationError
 * @returns {ValidaitonError[]}
 */
function mapChildrenToValidationErrors(
    error: ValidationError,
): ValidationError[] {
    if (!(error.children && error.children.length)) {
        return [error];
    }
    const validationErrors = [];
    for (const item of error.children) {
        if (item.children && item.children.length) {
            item.property = `${error.property}.${item.property}`;
            validationErrors.push(...mapChildrenToValidationErrors(item));
        }
        validationErrors.push(prependConstraintsWithParentProp(error, item));
    }
    return validationErrors;
}

/**
 * Flatten validation error
 * @param {ValidationError[]} validationErrors ValidationError[]
 * @returns {ValidationError[]}
 */
function flattenValidationError(validationErrors: ValidationError[]): ValidationError[] {
    return iterate(validationErrors)
        .map(error => mapChildrenToValidationErrors(error))
        .flatten()
        .filter(item => !!item.constraints)
        .map(item => ({ [item.property]: Object.values(item.constraints) }))
        .toArray() as any;
}

/**
 * Flatten validation error
 * @param {ValidationError[]} validationErrors ValidationError[]
 * @returns {HttpException}
 */
export function exceptionFactory(validationErrors: ValidationError[]): HttpException {
    return new UnprocessableEntityException(
        flattenValidationError(validationErrors)
    );
};
