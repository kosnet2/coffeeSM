class Cors {
    static solve(req, res, next) {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD',
            'Access-Control-Max-Age': '3600'
        });
        next();
    }
}

export default Cors;
