'use strict';

var _ = require('underscore');
var hosts = [];
var timeout = 2;

var hosts = {

	// Hosts should continually call this (every second or so) for as long as they are available
	addHost: function (req, res) {

		var name = req.params.hostName;
		var address = req.params.hostIp;
		var host = _.find(hosts, function (x) { return x.name === name && x.address === address; });
		
		if (host !== undefined) {
			host.time = Date.now();
		} else {
			hosts.push({
				name: name,
				address: address,
				time: Date.now()
			});
		}

		res.send(hosts);
	},

	// Explicitly remove a host (not required)
	removeHost: function (req, res) {
		hosts = _.filter(hosts, function(x) { return x.address != req.params.hostIp; });
		res.send(hosts);
	},

	// Returns a list of active hosts, filtering out those that have timed out
	getHosts: function (req, res) {
		var data = {};
		hosts = _.filter(hosts, function(x) { return x.time > Date.now()-timeout*1000; });
		data.hosts = hosts;
		res.send (data);
	}
};

module.exports = hosts;