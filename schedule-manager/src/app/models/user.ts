export class User {
    name: String;
    surname: String;
    email: String;
    password: String;
    alias ?: String;
    age ?: Number;
    priviledge: String;
    rate: {
        hourly ?: Number,
        fixed ?: Number,
        unpaid ?: Boolean,
    };
    unavailability ?: {
        daysOff ?: Array<Boolean>,
        hoursOff ?: Array<{
            start: Date,
            end: Date
        }>
    };
}
