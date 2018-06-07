import {QuillDelta} from "../../../../models/IQuillDelta";

export class EventSettings{
    PromoterWelcome:PromoterWelcomeEmailSettings = new PromoterWelcomeEmailSettings();
    RegistrantWelcome:RegistrantWelcomeEmailSettings = new RegistrantWelcomeEmailSettings();
    EventReminder:EventReminderEmailSettings = new EventReminderEmailSettings();
    EventCompletion:EventCompletionEmailSettings = new EventCompletionEmailSettings();
    RegistrationFields:EventFormFields = new EventFormFields();
    Confirmation:EventConfirmationSettings = new EventConfirmationSettings();
}

export interface IEmailSettings{
    enabled?:boolean;
    daysBefore?:number;
    daysAfter?:number;
    subject:string;
    body:any;
    html:string;
}

export class PromoterWelcomeEmailSettings implements IEmailSettings{
    enabled:boolean = true;
    subject:string = " ";
    body:any = new EmptyQuill();
    html:string = "";
}

export class RegistrantWelcomeEmailSettings implements IEmailSettings{
    enabled:boolean = true;
    subject:string = " ";
    body:any = new EmptyQuill();
    html:string = "";
}

export class EventReminderEmailSettings implements IEmailSettings{
    enabled:boolean = true;
    daysBefore:number = 1;
    subject:string = " ";
    body:any = new EmptyQuill();
    html:string = "";
}

export class EventCompletionEmailSettings implements IEmailSettings{
    enabled:boolean = true;
    subject:string = " ";
    body:any = new EmptyQuill();
    daysAfter:number = 1;
    html:string = "";
}

export class EventConfirmationSettings{
    enabled:boolean = true;
    message:any = new EmptyQuill();
}

export class EnabledRequired{
    enabled:boolean;
    required:boolean;

    constructor(enabled, required){
        this.enabled = enabled;
        this.required = required;
    }

}

export class EmptyQuill{

    ops:any = [ {
        "insert" : " \n"
    } ]

}

export class EventFormFields{
    $value;
    $exists;
    prefix:EnabledRequired = new EnabledRequired(false, false);
    firstName:EnabledRequired = new EnabledRequired(true, true);
    lastName:EnabledRequired = new EnabledRequired(true, true);
    suffix:EnabledRequired = new EnabledRequired(false, false);
    email:EnabledRequired = new EnabledRequired(true, true);
    phone:EnabledRequired = new EnabledRequired(true, true);
    homeAddress:EnabledRequired = new EnabledRequired(false, false);
    shippingAddress:EnabledRequired = new EnabledRequired(false, false);
    website:EnabledRequired = new EnabledRequired(false, false);
    gender:EnabledRequired = new EnabledRequired(false, false);
    birthDate:EnabledRequired = new EnabledRequired(false, false);
    age:EnabledRequired = new EnabledRequired(false, false);
    doTerraAccount:EnabledRequired = new EnabledRequired(true, false);
    doTerraRank:EnabledRequired = new EnabledRequired(false, false);
    customFields:EnabledRequired[] = [];

    //TYPES text (vanilla input), select, checkbox, multiselect
    nameMap = {
        prefix:{order:1, label:"Prefix", type:"text"},
        firstName:{order:2, label:"First Name",type:"text"},
        lastName:{order:3, label:"Last Name",type:"text"},
        suffix:{order:4, label:"Suffix",type:"text"},
        email:{order:5, label:"Email",type:'text'},
        phone:{order:6, label:"Phone",type:'text'},
        homeAddress:{order:7, label:"Home Address",type:'text'},
        shippingAddress:{order:8, label:"Shipping Address",type:'text'},
        website:{order:9, label:"Website",type:'text'},
        gender:{order:10, label:"Gender",type:'select', values:[{value:"male", label:"Male"}, {value:"female", label:"Female"}]},
        birthDate:{order:11, label:"Website",type:'date'},
        age:{order:12, label:"Age",type:'text'},
        doTerraAccount:{order:13, label:"Do you have a doTerra Wholesale account?",type:"checkbox"},
        doTerraRank:{order:14, label:"What is your doTerra rank?",type:"select",values:[{value:"bronze", label:"Bronze"}, {value:"silver", label:"silver"}, {value:"gold", label:"gold"}]}
    }

}
