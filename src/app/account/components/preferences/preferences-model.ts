export interface IAccountPreferences {
    $key?: string;
    $exists?;
    personNewEvent: boolean;
    placeNewEvent: boolean;
    newsletter: boolean;
    features: boolean;


}

export class AccountPreferences implements IAccountPreferences {
    personNewEvent = false;
    placeNewEvent = false;
    newsletter = false;
    features = false;

    constructor() {
        this.personNewEvent = false;
        this.placeNewEvent = false;
        this.newsletter = false;
        this.features = false;
    }

}
