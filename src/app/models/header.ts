export interface IHeader {
    $value: string;
}

export class Header {
    $value: string = "";

    constructor(first?) {
        this.$value = first;
    }
}