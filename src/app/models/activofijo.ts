import { IActivofijo} from '../interfaces/iactivofijo';

import { set, get } from 'lodash-es';

export class Activofijo implements IActivofijo {

    constructor(data) {
        set(this, 'data', data);
    }

    get id() {
        return get(this, 'data.id');
    }

    set id(value: string) {
        set(this, 'data.id', value);
    }

    get name() {
        return get(this, 'data.name');
    }

    set name(value: string) {
        set(this, 'data.name', value);
    }

    get user() {
        return get(this, 'data.user');
    }

    set user(value: string) {
        set(this, 'data.user', value);
    }

    getData() {
        return get(this, 'data');
    }
}
