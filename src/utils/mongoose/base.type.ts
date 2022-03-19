import { DocumentQuery } from 'mongoose';
import { BaseSchema } from "./base.schema";
import { DocumentType } from "@typegoose/typegoose";

export type QueryList<T extends BaseSchema> = DocumentQuery<Array<DocumentType<T>>, DocumentType<T>>;

export type QueryItem<T extends BaseSchema> = DocumentQuery<DocumentType<T>, DocumentType<T>>;
