import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import {Injectable, EventEmitter} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {IoEvent, oEvent} from "../../shared-models/oevent";
import {IDraftDate, DraftDate, IRecurringMonthlyDate} from "../models/date.models";
import {ToastyService} from "ng2-toasty";
import * as moment from 'moment';
import {GroomedDate} from "../models/date.models";
import {AuthService} from "../../auth/services/auth-service";

@Injectable()
export class CreateEventDateService {

    dateObject$:FirebaseObjectObservable<any>;
    dateObjectSet:boolean = false;
    dateObjectSetEmitter:EventEmitter<any> = new EventEmitter();

    dateList$:FirebaseListObservable<any[]>;
    dateListSet:boolean = false;

    eventId:string;
    eventSet:boolean = false;

    localDateObject:IDraftDate = new DraftDate();
    localDateObjectSet:boolean = false;

    constructor(private af: AngularFireDatabase, private auth: AuthService, private toasty:ToastyService) {

    }

    // -----------------------------------------------------------------------------------------------------------------------
    // INITIALIZE DATE OBJECT... BASED ON EVENT ID. EITHER THERE IS A DATE OBJ SET FOR THIS EVENT OR NOT (/drafts/date/<event_id>)
    // -----------------------------------------------------------------------------------------------------------------------
    initializeDate(eventId):void{

        //SET CLASS PROPERTIES
        this.eventInit(eventId);

        //CHECK IF THERE IS AN EXISTING OBJECT, IF NOT CREATE ONE
        this.dateObject$.first().subscribe((data)=>{

            if(data.$exists()){
                this.localDateObject = data;
                this.localDateObjectSet = true;
                this.dateObjectSetEmitter.emit();
            }
            else{
                this.createNewDate();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // CREATE NEW DATE OBJECT
    // -----------------------------------------------------------------------------------------------------------------------
    createNewDate(){

        //DEFAULT IT TO SINGLE DAY IN THIS INSTANCE
        this.localDateObject.eventType = "singleDay";

        this.dateObject$.set(this.localDateObject).then(()=>{
            this.localDateObjectSet = true;
            this.dateObjectSetEmitter.emit();
        }, (error)=>{
            this.toasty.error({
                title:"error creating draft",
                msg: error.message
            });
        })
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // INITIALIZE EVERYTHING BASED ON EVENT ID
    // -----------------------------------------------------------------------------------------------------------------------
    eventInit(eventId):void{
        this.eventId = eventId;
        this.eventSet = true;
        this.linkFirebase(eventId);
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // CREATE FIREBASE LINKAGE BASED ON EVENT ID
    // -----------------------------------------------------------------------------------------------------------------------
    linkFirebase(eventId):void{
        this.dateObject$ = this.af.object(`/drafts/date/${this.auth.id}/${eventId}`);
        this.dateObjectSet = true;

        this.dateList$ = this.af.list(`/drafts/date/${this.auth.id}`);
        this.dateListSet = true;
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // CENTRAL PLACE TO GROOM DATE DATA FROM INPUTS - THERE IS A SWITCH AT THE BOTTOM BASED ON TYPE THAT SELECTS THE PROPER FUNCTION
    // -----------------------------------------------------------------------------------------------------------------------
    groomDate(data, type){

        //UTITLITY FUNCTION TO CREAT MONTHLY DAY STRING
        let buildMonthlyDayString = function(data){
            //BUILD UP FOR READABLE STRING CREATION
            let weeks:string[] = [];
            let days:string[] = [];
            let weeksString:string = "";
            let weeksEnding:string = "The ";
            let daysString:string = "";

            for (let week of data.repeatOnWeeks.weekKeys){
                if(data.repeatOnWeeks[week]){
                    weeks.push(week);
                }
            }

            for (let day of data.repeatOnDays.dayKeys){
                if(data.repeatOnDays[day]){
                    days.push(day);
                }
            }

            //BUILD THE WEEK(S) OF THE MONTH PART OF THE STRING ACCOUNTING FOR ONE OR MULTIPLE
            if(weeks.length > 1){
                for(let week in weeks){
                    let numWeek:number = parseInt(week);

                    if(numWeek == (weeks.length-1)){//END IT WITH AN AND IF THERE ARE MORE THAN ONE
                        weeksString += ` and ${weeks[numWeek]} `;
                    } else{

                        //ADD IN COMMAS WHERE NECESSARY
                        if(weeks.length > 2){
                            if(numWeek != 0){
                                weeksString += " ";
                            }
                            weeksString += `${weeks[numWeek]},`;
                        }
                        else{
                            weeksString += weeks[numWeek];
                        }

                        weeksEnding = " weeks ";
                    }
                }



            } else{
                weeksString += weeks[0]+" ";
                weeksEnding = " week ";
            }

            //STRING BUILDING FOR THE DAYS
            if(days.length > 1){
                for(let day in days){
                    let numDay:number = parseInt(day);

                    if(numDay == (days.length - 1)){//END IT WITH AN "and" IF THERE ARE MORE THAN ONE
                        daysString += ` and ${days[numDay]} `;
                    } else{

                        //ADD IN COMMAS WHERE NECESSARY
                        if(days.length > 2){
                            if(numDay != 0){
                                daysString += " ";
                            }
                            daysString += `${days[numDay]},`;
                        }
                        else{
                            daysString += days[numDay];
                        }

                    }
                }

            } else{
                daysString += days[0];
            }

            let dateString = weeksString + daysString + ` ${moment(data.cycleStartDate).format('MM/DD/YY')} - ${moment(data.cycleEndDate).format('MM/DD/YY')}`;
            let timeString = `${moment(`2012-12-12 ${data.dailyStartTime}`).format('h:mm A')} - ${moment(`2012-12-12 ${data.dailyEndTime}`).format('h:mm A')}`;

            return{
                dateString: dateString,
                timeString: timeString
            }

        };

        //LOOP THROUGH CUSTOM DATES AND GET EARLIEST START DATE
        let getCustomStartDate = function(data):number{

            let returnDate = 0;
            let first:boolean = true;

            for(let custom of data){
                if(!first){
                    let compareDate = moment(custom.start.date + ' 12:00 AM');
                    let unixCompareDate = moment(compareDate).unix();
                    if(unixCompareDate < returnDate){
                        returnDate = unixCompareDate;
                    }
                }
                else{
                    let stageDate = moment(custom.start.date + ' 12:00 AM');
                    returnDate = moment(stageDate).unix();
                    first = false;
                }
            }

            return returnDate;

        };

        //LOOP THROUGH CUSTOM EVENTS AND GET LATEST DATE
        let getCustomEndDate = function(data){
            let returnDate = 0;
            let first:boolean = true;

            for(let custom of data){
                console.log(custom);
                if(!first){
                    let compareDate = moment(custom.end.date + ' 11:59:59 PM');
                    let unixCompareDate = moment(compareDate).unix();
                    if(unixCompareDate > returnDate){
                        returnDate = unixCompareDate;
                    }
                }
                else{
                    let stageDate = moment(custom.end.date + ' 11:59:59 PM');
                    returnDate = moment(stageDate).unix();
                    first = false;
                }
            }

            return returnDate;
        };

        //GROOM SINGLE DAY DATES
        let single = function(){

            let date = `${data.date.year}-${data.date.month}-${data.date.day}`;
            let startTime = `${data.start.hour}:${data.start.minute}`;
            let endTime = `${data.end.hour}:${data.end.minute}`;

            let dateString = `${moment(date).format('ddd, MMM Do')}`;
            let timeString = `${moment(`2012-12-12 ${startTime}`).format('h:mm A')} - ${moment(`2012-12-12 ${endTime}`).format('h:mm A')}`;

            let startDisplay = moment(date).startOf('day');
            let endDisplay = moment(date).endOf('day');

            let startDate = moment(startDisplay).unix();
            let endDate = moment(endDisplay).unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //GROOM MULTI DAY DATES
        let multi = function(){

            let origStart = `${data.start.date.year}-${data.start.date.month}-${data.start.date.day}`;
            let origEnd = `${data.end.date.year}-${data.end.date.month}-${data.end.date.day}`;
            let startTime = `${data.start.time.hour}:${data.start.time.minute}`;
            let endTime = `${data.end.time.hour}:${data.end.time.minute}`;

            let dateString = `${moment(origStart).format('MM/DD/YY')} - ${moment(origEnd).format('MM/DD/YY')}`;
            let timeString = `${moment(`2012-12-12 ${startTime}`).format('h:mm A')} - ${moment(`2012-12-12 ${endTime}`).format('h:mm A')}`;

            let start = moment(origStart).startOf('day');
            let end = moment(origEnd).endOf('day');

            let startDate = moment(start).unix();
            let endDate = moment(end).unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);

        };

        //GROOM WEEKLY DATES
        let weekly = function(){
            let days:string = "";
            let first:boolean = true;

            for(let day of data.days.dayKeys){
                if (data.days[day]) {
                    if (first) {
                        days += day;
                        first = false;
                    }
                    else {
                        days += `, ${day}`;
                    }
                }
            }

            let dateString = `${moment(data.start.date).format('MM/DD/YY')} - ${moment(data.end.date).format('MM/DD/YY')}`;
            let timeString = `Every ${days} from ${moment(`2012-12-12 ${data.start.time}`).format('h:mmA')} to ${moment(`2012-12-12 ${data.end.time}`).format('h:mmA')}.`;

            let start = moment(data.start.date).startOf('day');
            let end = moment(data.end.date).endOf('day');

            let startDate = moment(start).unix();
            let endDate = moment(end).unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //GROOM BIWEEKLY DATES
        let biweekly = function(){
            let days:string = "";
            let first:boolean = true;

            for(let day of data.days.dayKeys){
                if (data.days[day]) {
                    if (first) {
                        days += day;
                        first = false;
                    }
                    else {
                        days += `, ${day}`;
                    }
                }
            }

            let dateString = `${moment(data.start.date).format('MM/DD/YY')} - ${moment(data.end.date).format('MM/DD/YY')}`;
            let timeString = `Every other ${days} from ${moment(`2012-12-12 ${data.start.time}`).format('h:mmA')} to ${moment(`2012-12-12 ${data.end.time}`).format('h:mmA')}.`;

            let start = moment(data.start.date).startOf('day');
            let end = moment(data.end.date).endOf('day');

            let startDate = moment(start).unix();
            let endDate = moment(end).unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //GROOM MONTHLYDATE DATES
        let monthlyDate = function(){
            let dateString = `Occurs the ${data.repeatOn} of each month.  Starts ${moment(data.cycleStartDate).format('MMM Do, YYYY')} and ends ${moment(data.cycleEndDate).format('MMM Do, YYYY')}`;
            let timeString = `${moment(`2012-12-12 ${data.dailyStartTime}`).format('h:mmA')} to ${moment(`2012-12-12 ${data.dailyEndTime}`).format('h:mmA')}`;

            let startDate = moment(data.cycleStartDate + " 12:00 AM").unix();
            let endDate = moment(data.cycleEndDate + " 11:59:59 PM").unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //GROOM MONTHY DAY DATES
        let monthlyDay = function(){

            let monthlyDay = buildMonthlyDayString(data);
            let dateString = monthlyDay.dateString;
            let timeString = monthlyDay.timeString;

            let start = moment(data.cycleStartDate).startOf('day');
            let end = moment(data.cycleEndDate).endOf('day');

            let startDate = moment(start).unix();
            let endDate = moment(end).unix();

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //GROOM CUSTOM DATES
        let custom = function () {
            let startDate = getCustomStartDate(data);
            let endDate = getCustomEndDate(data);
            let dateString = `Custom Dates from ${moment.unix(startDate).format('MM/DD/YY')} to ${moment.unix(endDate).format('MM/DD/YY')}`;
            let timeString = `Times are custom`;

            return new GroomedDate(dateString, timeString, startDate, endDate);
        };

        //DETECT TYPE AND RETURN PROPER DATA
        switch (type)
        {
            case'single':
                return single();
            case'multi':
                return multi();
            case'weekly':
                return weekly();
            case'biweekly':
                return biweekly();
            case'monthly-date':
                return monthlyDate();
            case'monthly-day':
                return monthlyDay();
            case'custom':
                return custom();
            default:
        }

    }

    createMultiple(dateData:IDraftDate){
        return this.getDates(dateData);
    }

    getDates(data:IDraftDate):any{

        let getMonthDate = function(data){
            let monthlyData:IRecurringMonthlyDate = data.recurring.monthlyDate;
            let repeatOn = parseInt(monthlyData.repeatOn);
            let beginningDay = parseInt(moment(monthlyData.cycleStartDate).format('D'));
            let events:any[] = [];
            let repeatDD = "";
            let currMonth:any;

            //GET DD FORMAT FOR REPEAT ON
            if(repeatOn < 10){
                repeatDD = "0"+repeatOn.toString();
            }
            else{
                repeatDD = repeatOn.toString();
            }

            //CHECK BEGINNING DATE TO SEE IF FIRST OCCURRENCE HAPPENS IN THE FIRST MONTH OR THE FOLLOWING
            if(repeatOn >= beginningDay){
                let firstEventDate = `${moment(monthlyData.cycleStartDate).format('YYYY')}-${moment(monthlyData.cycleStartDate).format('MM')}-${repeatDD}`;

                moment(data.cycleStartDate);
                currMonth = moment(firstEventDate);
                events.push(moment(currMonth).clone().unix());

            }
            else{
                let month = moment(monthlyData.cycleStartDate).add(1, 'month');
                let firstEventDate = `${moment(monthlyData.cycleStartDate).format('YYYY')}-${moment(month).format('MM')}-${repeatDD}`;
                currMonth = moment(firstEventDate);

                events.push(moment(currMonth).clone().unix());
            }

            let itMonth = moment(currMonth).add(1, 'month');

            //LOOP THROUGH MONTHS UNTIL IT'S DONE
            do
            {

                if(moment(itMonth) <= moment(monthlyData.cycleEndDate)){
                    events.push(moment(itMonth).unix());
                    itMonth = moment(itMonth).add(1, "month");
                }

            }
            while (moment(itMonth) <= moment(monthlyData.cycleEndDate));

            return events;
        };

        let monthDay = {
            getEvents : function(dateData:IDraftDate){

                let events:number[] = [];
                let repeatOnDays = this.getRepeatOnDays(dateData);
                let repeatOnWeeks = this.getRepeatOnWeeks(dateData);

                let start = moment(dateData.recurring.monthlyDay.cycleStartDate);
                let end = moment(dateData.recurring.monthlyDay.cycleEndDate);

                let iterator = moment(start).startOf('month');

                while (iterator < end) {

                    for(let week of repeatOnWeeks){
                        for(let day of repeatOnDays){

                            let date = this.getPeriodDay(iterator, week, day);

                            //CHECK THIS SINCE WE'RE ROLLING BACK TO THE FIRST DAY OF THE MONTH
                            if(date >= start && date <= end){
                                events.push(moment(date).unix());
                            }

                        }
                    }
                    //INCREMENT
                    iterator = moment(iterator).add(1, 'month');

                }

                return events;

            },

            getPeriodDay:function(monthDate, week, day){

                let periodEnum = {"First":0, "Second":1, "Third":2, "Fourth":3};
                let dayEnum = {"Sun":0, "Mon":1, "Tue":2, "Wed":3, "Thu":4, "Fri":5, "Sat":6};

                let weekNum = periodEnum[week];
                let dayNum = dayEnum[day];

                let firstDay = parseInt(moment(monthDate).startOf('month').format('d'));
                let lastDay = parseInt(moment(monthDate).endOf('month').format('d'));
                let daysInMonth = moment(monthDate).daysInMonth();

                //DAY OF THE MONTH
                let returnDay:number;

                //COUNT IT BACKWARDS
                if(week == "Last"){
                    if(dayNum <= lastDay){
                        returnDay = daysInMonth - (lastDay - dayNum);
                    }
                    //WRAP AROUND
                    else{
                        returnDay = daysInMonth - 7 + (dayNum-lastDay);
                    }

                }

                //GET DAY OUT OF THE FIRST 28 DAYS... NOTE THIS WILL NOT GET "5TH WEEK" DAYS WHICH WOULD BE 29, 30 & 31
                else{

                    //CHECK IF IT NEEDS TO WRAP AROUND TO THE SECOND ITERATION (LIKE IF LOOKING FOR FIRST MONDAY, BUT MONTH STARTS ON THURSDAY... THIS ADDS ONE TO THE WEEK)
                    if(dayNum >= firstDay){
                        returnDay = (1 + dayNum - firstDay) + (weekNum * 7);
                    }
                    else{
                        //WRAP AROUND TO GET THE DAY

                        //WANT 3RD TUESDAY IN APRIL
                        //firstDay = 6
                        //dayNum = 2
                        //weekNum = 3
                        //expect = 18

                        returnDay = (1 + (7-firstDay) + dayNum) + (weekNum * 7);
                    }
                }

                let stageReturnDay = moment(moment(monthDate).format('YYYY-MM')+"-"+this.formatDay(returnDay));
                return stageReturnDay;

            },

            formatDay : function(day){
                let stringDay:string = "";
                if(day < 10){
                    stringDay = "0"+day.toString();
                }
                else{
                    stringDay = day.toString();
                }
                return stringDay;
            },

            getRepeatOnDays : function(dateData) {

                let repeatOnDays = [];

                for (let day of dateData.recurring.monthlyDay.repeatOnDays.dayKeys) {
                    if (dateData.recurring.monthlyDay.repeatOnDays[day]) {
                        repeatOnDays.push(day);
                    }
                }

                return repeatOnDays;
            },

            getRepeatOnWeeks : function(dateData) {

                let repeatOnWeeks = [];

                for(let week of dateData.recurring.monthlyDay.repeatOnWeeks.weekKeys){
                    if(dateData.recurring.monthlyDay.repeatOnWeeks[week]){
                        repeatOnWeeks.push(week);
                    }
                }
                return repeatOnWeeks;
            }

        };

        let weekly = {
            getEvents: function(dateData:IDraftDate){

                let dayEnum = {"Sun":0, "Mon":1, "Tue":2, "Wed":3, "Thu":4, "Fri":5, "Sat":6};

                let events:number[] = [];

                let start = moment(dateData.recurring.weekly.start.date);
                let end = moment(dateData.recurring.weekly.end.date);
                let repeatOnDays = this.getRepeatOnDays(dateData);

                //KICK BACK TO THE BEGINNING OF EVERY WEEK TO ITERATE WEEK BY WEEK
                let iterator = moment(start).clone().startOf('week');

                //REPEAT WEEK BY WEEK THROUGH THE DATE RANGE
                while (iterator < end) {

                    //GO THROUGH EACH SELECTED DAY
                    for(let day of repeatOnDays){

                        let dayNum = dayEnum[day];
                        let date = moment(iterator).clone().add(dayNum, 'day');

                        //CHECK SINCE WE'VE GONE BACK TO THE BEGINNING OF THE WEEK
                        if(date >= start && date <= end){
                            events.push(moment(date).unix());
                        }

                    }

                    //INCREMENT
                    iterator = moment(iterator).add(1, 'week');

                }

                return events;

            },
            getRepeatOnDays : function(dateData) {

                let repeatOnDays = [];

                for (let day of dateData.recurring.weekly.days.dayKeys) {
                    if (dateData.recurring.weekly.days[day]) {
                        repeatOnDays.push(day);
                    }
                }

                return repeatOnDays;
            }
        };

        let biweekly = {
            getEvents: function(dateData:IDraftDate){

                let dayEnum = {"Sun":0, "Mon":1, "Tue":2, "Wed":3, "Thu":4, "Fri":5, "Sat":6};

                let events:number[] = [];

                let start = moment(dateData.recurring.biweekly.start.date);
                let end = moment(dateData.recurring.biweekly.end.date);
                let repeatOnDays = this.getRepeatOnDays(dateData);

                //KICK BACK TO THE BEGINNING OF EVERY WEEK TO ITERATE WEEK BY WEEK
                let iterator = moment(start).clone().startOf('week');

                //REPEAT WEEK BY WEEK THROUGH THE DATE RANGE
                while (iterator < end) {

                    //GO THROUGH EACH SELECTED DAY
                    for(let day of repeatOnDays){

                        let dayNum = dayEnum[day];
                        let date = moment(iterator).clone().add(dayNum, 'day');

                        //CHECK SINCE WE'VE GONE BACK TO THE BEGINNING OF THE WEEK
                        if(date >= start && date <= end){
                            events.push(moment(date).unix());
                        }

                    }

                    //INCREMENT
                    iterator = moment(iterator).add(2, 'week');

                }

                return events;

            },
            getRepeatOnDays : function(dateData) {

                let repeatOnDays = [];

                for (let day of dateData.recurring.biweekly.days.dayKeys) {
                    if (dateData.recurring.biweekly.days[day]) {
                        repeatOnDays.push(day);
                    }
                }

                return repeatOnDays;
            }
        };

        switch(data.recurring.type){
            case 'monthly-date':
                return getMonthDate(data);
            case 'monthly-day':
                return monthDay.getEvents(data);
            case 'weekly':
                return weekly.getEvents(data);
            case 'biweekly':
                return biweekly.getEvents(data);
            default:
                return [];
        }
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // SHOW DATE BASED ON ONE DATE (FOR THE MULTIPLE CREATED EVENTS FROM AN OCCURING EVENT)
    // -----------------------------------------------------------------------------------------------------------------------
    createDateString(date:any):string{
        return moment(date).format('ddd, MMM Do YYYY');
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // GET NUMBER OF EVENTS OCCURING IN CURRENT MONTH
    // -----------------------------------------------------------------------------------------------------------------------
    eventsThisMonth(events:number[]):number[]{
        let monthEvents:number[] = [];
        let endOfMonth = moment().endOf('month').unix();

        for(let event of events){
            if(event < endOfMonth){
                monthEvents.push(event);
            }
        }

        return monthEvents;
    }


}
