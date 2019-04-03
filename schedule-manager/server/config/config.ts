/*
*   Provides url of the database including the port the db will be running
*   For MongoDB the default port is 27017.
*/
const config = {
    db_name: 'schedule-manager',
    db_domain: 'localhost',
    db_port: '27017',
    dbUrl: 'mongodb://localhost:27017/schedule-manager',
    jwt_secret: 'kR4HrH8wKZh9cW3@^SWc5at4!EXX9rz99kTVqxgB'
};

export default config;
