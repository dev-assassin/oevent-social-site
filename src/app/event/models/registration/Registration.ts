import { BuyerInfo } from './BuyerInfo';
import { FormField } from './FormField';
import { RegistrationTicket } from './RegistrationTicket';
import { Promoter } from '../promoter';

export class Registration {
    ocode: string;
    buyerInfo: BuyerInfo;
    formFields: FormField[];
    tickets: RegistrationTicket[];
    termsAccepted: boolean;
    promoters: Promoter[];
    registrationEventKey?: string;
    registrationUserKey?: string;
}
