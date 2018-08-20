export interface IHeader {
    $value: string;
}

export class Header {
    $value = '';

    constructor(first?) {
        this.$value = first;
    }
}
