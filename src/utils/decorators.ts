import { SetMetadata } from "@nestjs/common";

/**
 * Set role metadata
 * @param {...Array<string>} roles Roles
 * @returns {any}
 */
export const Roles = (...roles: Array<string>) => SetMetadata('roles', roles);
