export interface IAccountAbout {
    $key?: string;
    organizerName: string;
    tagLine: string;
    aboutMe: string;
    includeEmail: boolean;
    includePhone: boolean;
    includeSocials: boolean;
    includeWebsite: boolean;
    website: string;
    imageSet: boolean;
    imageURL: string;
    phone: string;
    email: string;
    $exists?();
}

export class AccountAbout implements IAccountAbout {
    organizerName = '';
    aboutMe = '';
    tagLine = '';
    includeEmail = false;
    includePhone = false;
    includeSocials = false;
    includeWebsite = false;
    website = '';
    imageSet = false;
    imageURL = '';
    phone = '';
    email = '';

    constructor() {

    }

}
