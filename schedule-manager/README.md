# ScheduleManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Prerequisites to run the project

# First time run
1. Run `npm install --save` in server folder
2. Run `npm install --save` in schedule-manager folder

# Every time
1. Navigate into server folder. Run `tsc`. Leave the terminal running. Open another one
2. Start mongo on the new terminal. Run `mongod`. Leave the terminal running. Open another one
3. In server folder. Run `npm run start` to run the server. Leave the terminal running. Open another one.
4. Go one level above the server folder that is into schedule-manager. Run `ng serve` to run Angular on your localhost. Leave the terminal running. Open another one.
5. Start working. You should now have the server running on localhost:3000, the database running on localhost:27017, angular running on localhost:4200.