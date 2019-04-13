import userSchema from '../models/user';
import scheduleSchema from '../models/schedule';
import * as mongoose from 'mongoose';


const scheduleModel = mongoose.model('Schedule', scheduleSchema);

class Schedules {
    addSchedule(req, res) {
        const scheduleDoc = req.body;
        scheduleModel.create(scheduleDoc).then((response: any) => {
	  return res.json({ schedule: response, message: 'Schedule successfully added'});
        }).catch( err => {
	  return res.status(400).json({ message: 'Database error: Could not add schedule', error: err });
        });
	}

	addSchedules(req, res) {
		const schedulesDoc = req.body;
		scheduleModel.insertMany(schedulesDoc).then((response: any) => {
			return res.json({ schedule: response, message: 'Schedule successfully added'});
		}).catch( err => {
			return res.status(400).json({ message: 'Database error: Could not add schedule', error: err });
		});
	}

	getScheduleRange(req, res) {
		const range = JSON.parse(req.params.range);
		const start = new Date(range.start);
		const end = new Date(range.end);

		scheduleModel.find({'dateTime' : {$gt: new Date(range.start), $lt: new Date(range.end) }}).then((schedules: any) => {
			return res.json(schedules);
			  }).catch(err => {
			return res.status(400).json({
				message: 'Database error: Could not get schedule',
				error: err
			});
		 });
	}

    deleteSchedule(req, res) {
        const id = req.params.id;

        scheduleModel.deleteOne( { '_id': id}).then((response: any) => {
	  if (response.deletedCount) {
	      return res.json({
		success: true,
		message: 'Schedule successfully deleted'
	      });
	  } else {
	      return res.json({
		success: false,
		message: 'Schedule does not exist'
	      });
	  }
        }).catch(err => {
	  return res.status(400).json({
	      message: 'Database error: Could not delete schedule',
	      error: err
	  });
        });
    }

    updateSchedule(req, res) {
        const scheduleDoc = req.body;
		const from = new Date(req.body.from);
		from.setMinutes(from.getMinutes() - 30);
		const to = new Date(req.body.to);
		
		to.setMinutes(to.getMinutes() - 30);	// mongod db lt is not inclusive
		const userId = req.body.userId;

		scheduleModel.updateMany({'dateTime' : {$gt: from, $lt: to }}, {$addToSet: {'allocatedStaff': userId}}).then( response => {
	  if (response.n) {
	      return res.json({
			success: true,
			message: response.nModified ? 'Schedule successfully updated' : 'Schedule is the same',
			schedule: scheduleDoc
	      });
	  } else {
	    	return res.json({
		success: false,
		message: 'Schedule does not exist'
	      });
	  }
        }).catch(err => {
	  return res.status(400).json({
	      message: 'Database error: Could not update schedule',
	      error: err
	  });
        });
	}
	
	removeUserFromSchedule(req, res){
		const scheduleDoc = req.body;
		const from = new Date(req.body.from);
		const to = new Date(req.body.to);
		to.setMinutes(to.getMinutes() + 30);	// mongod db lt is not inclusive
		const userId = req.body.userId;

		scheduleModel.updateMany({'dateTime' : {$gt: from, $lt: to }}, { $pull: {'allocatedStaff': userId}}).then( response => {
			if (response.n) {
				return res.json({
				success: true,
				message: response.nModified ? 'Schedule successfully updated' : 'Schedule is the same',
				schedule: scheduleDoc
				});
			} else {
				return res.json({
					success: false,
					message: 'Schedule does not exist'
				});
			}
			}).catch(err => {
			return res.status(400).json({
				message: 'Database error: Could not update schedule',
				error: err
			});
		});
	}
}

export default new Schedules();
