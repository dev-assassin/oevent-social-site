export class FieldValidation{
    fieldId:string;
    valid:boolean = true;
    errorMessage:string;


    static isEmptyText(text:string):boolean{
        if(!text || text.trim() == ""){
           return true;
        }
        return false;
    }

    static isEmailText(text:string):boolean{
        return false;
    }
}