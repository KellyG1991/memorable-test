import { Injectable, Scope } from '@nestjs/common';
import moment, { Moment } from 'moment-timezone';

/**
 * MomentService
 * @class
 * @property {moment.Moment} _now
 */
@Injectable({ scope: Scope.REQUEST })
export class MomentService {
    /** Current time */
    private readonly _now: Moment;

    /**
     * MomentService constructor
     */
    constructor() {
        this._now = moment();
    }

    /**
     * @returns {moment.Moment|null}
     */
    get now(): Moment {
        return this._now;
    }

    /**
     * @returns {function}
     */
    get moment() {
        return moment;
    }
}
