//COMPLEXITY OF EVENT DATE TYPES MERITS COMPLEX SET OF OBJECTS (TODO REDUCE COMPLEXITY ONCE IMPLMENTATIONS SHOWS WHERE THIS IS OVERBOARD)


import {NgbDateStruct, NgbTimeStruct, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
interface IDayTime{
    date: NgbDateStruct;
    time: NgbTimeStruct;
}

export class DayTime implements IDayTime{
    date: NgbDateStruct;
    time: NgbTimeStruct;

    constructor(){

        let date = new Date();

        this.date = {
            day: date.getDate(),
            month: (date.getMonth() + 1),
            year: date.getFullYear()
        };

        this.time = {
           hour: 12,
            minute: 0,
            second: 0
        }
    }

}

export interface ISingleDay{
    date: NgbDateStruct;
    start: NgbTimeStruct;
    end: NgbTimeStruct;
}

export class SingleDay implements ISingleDay{
    date: NgbDateStruct;
    start: NgbTimeStruct;
    end: NgbTimeStruct;

    constructor(){

        let date = new Date();

        this.date = {
            month: (date.getMonth() + 1),
            day: date.getDate(),
            year: date.getFullYear()
        };

        this.start = {
           hour: 12,
            minute: 0,
            second: 0
        };

        this.end = {
           hour: 12,
            minute: 0,
            second: 0
        };
    }

}

export interface IMultiDay{
    start:IDayTime;
    end:IDayTime;
}

export class MultiDay implements IMultiDay{
    start:IDayTime;
    end:IDayTime;

    constructor(start:IDayTime = new DayTime(), end:IDayTime = new DayTime()){
        this.start = start;
        this.end = end;
    }

}

export interface IRecurring{
    type: string;
    monthlyDay: IRecurringMonthlyDay;
    monthlyDate: IRecurringMonthlyDate;
    weekly: IRecurringWeekly;
    biweekly: IRecurringWeekly
}

export class Recurring implements IRecurring{
    type:string = " ";
    monthlyDay:IRecurringMonthlyDay =  new RecurringMonthlyDay();
    monthlyDate:IRecurringMonthlyDate = new RecurringMonthlyDate();
    weekly:IRecurringWeekly = new RecurringWeekly();
    biweekly:IRecurringWeekly = new RecurringWeekly();
}

export interface IWeekDays{
    Mon:boolean;
    Tue:boolean;
    Wed:boolean;
    Thu:boolean;
    Fri:boolean;
    Sat:boolean;
    Sun:boolean;
    dayKeys:string[];
}

export class WeekDays implements IWeekDays{
    Mon:boolean = false;
    Tue:boolean = false;
    Wed:boolean = false;
    Thu:boolean = false;
    Fri:boolean = false;
    Sat:boolean = false;
    Sun:boolean = false;
    //EASY STRING BUILDING
    dayKeys:string[] = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];
}

export interface IMonthWeeks{
    First:boolean;
    Second:boolean;
    Third:boolean;
    Fourth:boolean;
    Fifth:boolean;
    Last:boolean;
    weekKeys:string[];
}

export class MonthWeeks implements IMonthWeeks{
    First:boolean;
    Second:boolean;
    Third:boolean;
    Fourth:boolean;
    Fifth:boolean;
    Last:boolean;
    //SIMPLIFY STRING BUILDING (THESE WILL LOOP IN ORDER)
    weekKeys:string[] = [
        "First", "Second", "Third", "Fourth", "Last"
    ];
}

export interface IRecurringWeekly{
    reapeatOn: string[];
    start: IDayTime;
    end: IDayTime;
    days: IWeekDays;
}

export class RecurringWeekly implements IRecurringWeekly{
    reapeatOn: string[] = [];
    start: IDayTime = new DayTime();
    end: IDayTime = new DayTime();
    days: IWeekDays = new WeekDays();

    constructor(){
    }

}

export interface IRecurringMonthlyDay{
    repeatOnWeeks:IMonthWeeks;
    repeatOnDays:IWeekDays;
    dailyStartTime: NgbTimeStruct;
    dailyEndTime: NgbTimeStruct;
    cycleStartDate: NgbDateStruct;
    cycleEndDate: NgbDateStruct;
}

export class RecurringMonthlyDay implements IRecurringMonthlyDay{

    repeatOnWeeks:IMonthWeeks = new MonthWeeks();
    repeatOnDays:IWeekDays = new WeekDays();
    dailyStartTime: NgbTimeStruct;
    dailyEndTime: NgbTimeStruct;
    cycleStartDate: NgbDateStruct;
    cycleEndDate: NgbDateStruct;

    constructor(){

        let date = new Date();

        this.cycleStartDate = this.cycleEndDate = {
            month: (date.getMonth() + 1),
            day: date.getDate(),
            year: date.getFullYear()
        };

        this.dailyStartTime = this.dailyEndTime = {
           hour: 12,
            minute: 0,
            second: 0
        };

    }

}

export interface IRecurringMonthlyDate{
    repeatOn: any;
    dailyStartTime: NgbTimeStruct;
    dailyEndTime: NgbTimeStruct;
    cycleStartDate: NgbDateStruct;
    cycleEndDate: NgbDateStruct;
}

export class RecurringMonthlyDate implements IRecurringMonthlyDate{
    repeatOn: any = " ";
    dailyStartTime: NgbTimeStruct;
    dailyEndTime: NgbTimeStruct;
    cycleStartDate: NgbDateStruct;
    cycleEndDate: NgbDateStruct;

    constructor(){

        let date = new Date();

        this.cycleStartDate = this.cycleEndDate = {
            month: (date.getMonth() + 1),
            day: date.getDate(),
            year: date.getFullYear()
        };

        this.dailyStartTime = this.dailyEndTime = {
           hour: 12,
            minute: 0,
            second: 0
        };

    }


}

export interface IDraftDate{
    $key?: string;
    $exists?();
    eventType: string;
    single: ISingleDay;
    multi: IMultiDay;
    recurring: IRecurring;
    course: IRecurring;
    custom: IMultiDay[];
}

export class DraftDate implements IDraftDate{

    eventType: string;

    single: ISingleDay = new SingleDay();
    multi: IMultiDay = new MultiDay();
    recurring: IRecurring = new Recurring();
    course: IRecurring = new Recurring();
    custom: IMultiDay[] = [];

    constructor(eventType:string = " ") {
         this.eventType = eventType;
    }



}

export interface IGroomedDate{
    dateString:string;
    timeString:string;
    startDate:number;
    endDate:number;
}

export class GroomedDate implements IGroomedDate{

    dateString:string;
    timeString:string;
    startDate:number;
    endDate:number;

    constructor(dateString, timeString, startDate, endDate){
        this.dateString = dateString;
        this.timeString = timeString;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}