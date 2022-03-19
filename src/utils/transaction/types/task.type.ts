import { FilterQuery } from "mongoose";
import { ObjectType } from "../../types";
import { ReturnModelType } from "@typegoose/typegoose";
import { BaseSchema } from "../../mongoose/base.schema";
import { AnyParamConstructor, DocumentType } from "@typegoose/typegoose/lib/types";

export declare type FawnTaskOptions<T = BaseSchema> = {
    save: FawnTaskSaveOption<FawnTaskOptions<T>, T>,
    update: FawnUpdateOption<FawnTaskOptions<T>, T>,
    remove: FawnRemoveOption<FawnTaskOptions<T>, T>,
    run: (options?: { useMongoose?: true }) => void
};

export declare type FawnTaskSaveOption<T, U> = (
    Model: ModelType<U> | Document<U> | string,
    document?: Document<U>,
) => T;

export declare type FawnUpdateOption<T, U> = (
    Model: ModelType<U> | Document<U> | string,
    query: Query<U> | ObjectType | Partial<Document<U>>,
    document?: ObjectType | Partial<Document<U>>,
) => T;

export declare type FawnRemoveOption<T, U> = (
    Model: ModelType<U> | Document<U> | string,
    query?: Query<U>,
) => T;

export declare type ModelType<T> = ReturnModelType<AnyParamConstructor<T>> | Document<T>;

export declare type Document<T> = DocumentType<T>;

export declare type Query<T> = FilterQuery<T>;
