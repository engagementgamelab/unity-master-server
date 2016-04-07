'use strict';

exports = module.exports = function (app, mongoose) {

	var messageSchema = new mongoose.Schema({
		key: String,
		str1: String,
		str2: String,
		val: Number,
		confirmations: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
			default: []
		}]
	});

	messageSchema.methods.confirmReceipt = function (clientId, clientCount, cb) {
		var that = this;
		this.update({ '$addToSet': { 'confirmations': clientId } }, function(err, n) {
			if (that.confirmations.length+1 >= clientCount) {
				// console.log(that);
				that.remove(function() {
					cb();
				})
			} else {
				cb();
			}
		});
	};

	/*messageSchema.post('update', function() {
		console.log(this.confirmations);
		if (this.confirmations.length+1 >= clientCount)
			this.remove();
	});*/

	app.db.model('Message', messageSchema);
};