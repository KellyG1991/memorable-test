export type ObjectType = Record<string, any>;

export interface ConstructorType<T = any> extends Function {
    new(...args: any[]): T;
}
