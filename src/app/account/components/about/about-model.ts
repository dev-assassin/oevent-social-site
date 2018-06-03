export interface IAccountAbout{
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
    email: string
    $exists?();
}

export class AccountAbout implements IAccountAbout{
    organizerName: string = "";
    aboutMe: string = "";
    tagLine: string = "";
    includeEmail: boolean = false;
    includePhone: boolean = false;
    includeSocials: boolean = false;
    includeWebsite: boolean = false;
    website: string = "";
    imageSet: boolean = false;
    imageURL: string = "";
    phone:string = "";
    email:string = "";

    constructor() {

    }

}