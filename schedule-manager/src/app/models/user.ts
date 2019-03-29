/*
*   The class defining a user
*/
export class User {
    name: string;
    surname: string;
    email: string;
    password: string;
    alias ?: string;
    age ?: Number;
    priviledge: string;
    position: string;
    rate: string;
    amount: Number;
    unavailability ?: {
        permanent?: {
            monday: Array<string>,
            tuesday: Array<string>,
            wednesday: Array<string>,
            thursday: Array<string>,
            friday: Array<string>,
            saturday: Array<string>,
            sunday: Array<string>
        },
        requested?: Array<{fromDate: Date, toDate: Date}>
    };

    constructor() {
        this.unavailability = {
            permanent: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
            },
            requested: []
        };
    }
}
