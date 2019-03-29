import positionsSchema from '../models/positions';
import * as mongoose from 'mongoose';


const positionsModel = mongoose.model('Positions', positionsSchema);

class Positions {
    /*
    *   Get the positions
    *   findOne is used since its gonna be a unique document
    */
    getPositions(req, res) {
        positionsModel.findOne().then((positions: any) => {
            return res.json(positions);

        }).catch(err => {
            return res.status(400).json({
                message: 'Database error: Could not get positions',
                error: err
            });
        });
    }

    /*
    *   Update the positions with the updated one provided
    */
    updatePositions(req, res) {
        const positionsDoc = req.body;

        positionsModel.updateOne({_id: positionsDoc._id }, positionsDoc).then( response => {
            if (response.n) {
                return res.json({
                    success: true,
                    message: response.nModified ? 'Positions successfully updated' : 'Positions are the same',
                    positions: positionsDoc
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Positions do not exist'
                });
            }
        }).catch(err => {
            return res.status(400).json({
                message: 'Database error: Could not update positions',
                error: err
            });
        });
    }
}

export default new Positions();
