import
{
  Types,
  Query,
  Aggregate,
  FilterQuery,
  SaveOptions,
  ModelUpdateOptions,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { ObjectType } from '../types';
import { BaseSchema } from './base.schema';
import { QueryItem, QueryList } from './base.type';
import { ReturnModelType } from '@typegoose/typegoose';
import { FawnTaskOptions } from '../transaction/types/task.type';
import
{
  AnyParamConstructor,
  DocumentType,
} from '@typegoose/typegoose/lib/types';

/**
 * BaseService
 * @class
 * @abstract
 * @property {ReturnModelType<AnyParamConstructor<T>>} model
 */
export abstract class BaseService<T extends BaseSchema> {
  /**
   * BaseService constructor
   * @param {ReturnModelType<AnyParamConstructor<T>>} model Model
   */
  protected constructor (
    /** @readonly */
    protected readonly _model: ReturnModelType<AnyParamConstructor<T>>,
  ) { }

  get model ()
  {
    return this._model;
  }

  /**
   * Construct mongoose.Types.ObjectId
   * @param id Entity ID
   * @returns {mongoose.Types.ObjectId}
   */
  toObjectId ( id: string ): Types.ObjectId
  {
    return Types.ObjectId( id );
  }

  /**
   * Constructs a new document entity.
   * @param doc {ObjectType} Document
   * @returns {Document<T>}
   */
  createModel ( doc?: T | Partial<T> ): DocumentType<T>
  {
    return new this._model( doc );
  }

  /**
   * Find entity by ID.
   * @param {mongoose.Types.ObjectId} id Entity ID.
   * @returns {QueryItem<T>}
   */
  findById ( id: Types.ObjectId ): QueryItem<T>
  {
    return this._model.findById( id );
  }

  /**
   * Find entity by filter.
   * @param {any} Query.
   * @returns {QueryItem<T>}
   */
  findOne ( filter: any = {} ): QueryItem<T>
  {
    return this._model.findOne( filter );
  }

  /**
   * Find entity by filter.
   * @param {any} Query.
   * @returns {QueryList<T>}
   */
  find ( filter: any = {} ): QueryList<T>
  {
    return this._model.find( filter );
  }

  /**
   * Create a new document of type T.
   * @param {CreateUserDto} doc Document
   * @return {Promise<DocumentType<T>}
   */
  create<
    U extends T | DocumentType<T>,
    V extends { transaction?: FawnTaskOptions<T> }
  > ( doc: U, options?: V ): Promise<DocumentType<T>> | FawnTaskOptions<T>;
  /**
   * Create a multiple documents of type T.
   * @param {Array<T>} docs Document
   * @return {Promise<Array<DocumentType<T>>>}
   */
  create<
    U extends Array<T | DocumentType<T>>,
    V extends { transaction?: FawnTaskOptions<T> }
  > (
    docs: Array<T>,
    options?: V,
  ): Promise<Array<DocumentType<T>>> | FawnTaskOptions<T>;
  create<U extends T | DocumentType<T>, V extends SaveOptions> (
    doc: U,
    options: SaveOptions,
  );
  /**
   * Create document(s) of tyep T.
   * @param {Array<T>|T} doc Document
   * @return {Promise<DocumentType<T>|Array<DocumentType<T>>>}
   */
  create<
    U extends T | DocumentType<T> | Array<T | DocumentType<T>>,
    V extends { transaction?: FawnTaskOptions<T> }
  > (
    doc: U,
    options?: V,
  ): Promise<DocumentType<T> | Array<DocumentType<T>>> | FawnTaskOptions<T>
  {
    if ( options?.transaction )
    {
      if ( Array.isArray( doc ) )
      {
        for ( const i in doc )
        {
          const item = doc[ i ];

          options.transaction.save( this.model, item );
        }
      } else
      {
        options.transaction.save( this.model, doc as DocumentType<T> );
      }

      return options.transaction;
    }

    return this._model.create( doc );
  }

  /**
   * Delete an entity of type T.
   * @param {any} filter Filter for entity to delete
   * @return {QueryItem<T>}
   */
  deleteOne (
    filter: FilterQuery<T> = {},
    options: { transaction: any },
  ): QueryItem<T>
  {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    return this._model.findOneAndDelete( filter as any );
  }

  /**
   * Delete an entity of type T by ID.
   * @param {string} id Enitty ID
   * @return {QueryItem<T>}
   */
  deleteById ( id: Types.ObjectId, options: { transaction: any } ): QueryItem<T>
  {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    return this._model.findByIdAndDelete( id );
  }

  /**
   * Delete entities of type T.
   * @param {any} filter
   * @return {any}
   */
  deleteMany ( filter: FilterQuery<T> = {} )
  {
    return this._model.deleteMany( filter as any );
  }

  /**
   * Update one entity of type T by filter.
   * @param {ObjectType} filter Filter
   * @param {ObjectType} doc Document
   * @param options Options
   * @return {QueryItem<T>}
   */
  updateOne (
    filter: FilterQuery<T> = {},
    doc?: ObjectType,
    options?: QueryFindOneAndUpdateOptions & { transaction?: any },
  ): QueryItem<T>
  {
    return this._model.findOneAndUpdate( filter as any, doc, options );
  }

  /**
   * Update one entity of type T by ID.
   * @param {mongoose.Types.ObjectId} id Entity Id
   * @param {ObjectType} doc Document
   * @param options Options
   * @return {QueryItem<T>}
   */
  updateById (
    id: Types.ObjectId,
    doc?: ObjectType,
    options?: QueryFindOneAndUpdateOptions & { transaction?: any },
  ): QueryItem<T>
  {
    return this._model.findByIdAndUpdate( id, doc, options );
  }

  /**
   * Update entity(ies) of type T by fillter.
   * @param {ObjectType} filter Filter
   * @param {ObjectType} doc Document
   * @param options Options
   * @return {QueryItem<T>}
   */
  updateMany (
    filter: any = {},
    doc: ObjectType,
    options?: ModelUpdateOptions,
  ): Query<T>
  {
    return this._model.updateMany( filter, doc, options );
  }

  aggregate ( pipeline: any[] = [] ): Aggregate<any>
  {
    return this._model.aggregate( pipeline );
  }
}
