export interface QuillDelta {
    new (ops: Array<any>) : QuillDelta;
    new (ops: any) : QuillDelta;
    ops?: Array<any>;
    retain(length: number, attributes: any) : QuillDelta;
    delete(length: number) : QuillDelta;
    filter(predicate: any) : QuillDelta;
    forEach(predicate: any) : QuillDelta;
    insert(text: any, attributes: any): QuillDelta;
    map(predicate: any) : QuillDelta;
    partition(predicate: any) : QuillDelta;
    reduce(predicate: any, initial: number): QuillDelta;
    chop() : QuillDelta;
    length(): number;
    slice(start: number, end: number): QuillDelta;
    compose(other: any): QuillDelta;
    concat(other: QuillDelta): QuillDelta;
    diff(other: QuillDelta, index: number) : QuillDelta;
    eachLine(predicate: any, newline: any) : QuillDelta;
    transform(other: any, priority: any) : QuillDelta;
    transformPosition(index: number, priority: any) : QuillDelta;
}