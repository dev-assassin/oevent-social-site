export interface IPromoter {
    name: string;
    ocode: string;
    val?();
    exists?();
    // tslint:disable-next-line:member-ordering
    createdAt?;
}

export class Promoter implements IPromoter {
    name = '';
    ocode = '';

    constructor(name?, ocode?) {
        this.name = name;
        this.ocode = ocode;
    }

}
