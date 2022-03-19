import { Types, Schema } from 'mongoose';
import { prop, modelOptions, buildSchema } from '@typegoose/typegoose';

/**
 * BaseSchema
 * @class
 * @abstract
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {mongoose.Types.ObjectId} _id
 * @property {string} id
 */
@modelOptions({
    schemaOptions: {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        toJSON: {
            getters: true,
            virtuals: true,
        },
    },
})
export abstract class BaseSchema {
    /** Time when entity was created. */
    @prop({ type: Date })
    created_at?: Date;

    /** Time entity was last updated. */
    @prop({ type: Date, select: false })
    updated_at?: Date;

    /** Entity ID. */
    @prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    /** String entity ID. */
    @prop({ type: String })
    id: string;

    @prop({ type: Number, select: false })
    __v: number;

    /**
     * The mongoose schema.
     * @returns {mongoose.Schema}
     */
    static get buildSchema(): Schema {
        return buildSchema(this as any);
    }

    /**
     * The name of the schema.
     * @returns {string}
     */
    static get modelName(): string {
        return this.name;
    }
}
