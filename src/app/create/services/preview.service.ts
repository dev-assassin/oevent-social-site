import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ITicket, Ticket } from '../models/tickets.models';
import { CreateEventService } from './create-event.service';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class PreviewService {

    eventId: string;

    constructor(private af: AngularFireDatabase,
        private auth: AuthService
    ) {

    }

    setEventId(id) {
        this.eventId = id;
    }

}
