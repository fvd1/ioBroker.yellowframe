"use strict";

/*
 * Created with @iobroker/create-adapter v2.0.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const tools = require(utils.controllerDir + '/lib/tools');
const helper = require('./lib/tools');
const suncalc = require('suncalc');


const { callbackify } = require("util");

// Load your modules here, e.g.:
// const fs = require("fs");

class Yellowframe extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "yellowframe",
		});

		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));

		this.objectStorage = {};
		this.foreignIDs = [];
		//this.config = {};
		this.data = {};

	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
		let adapter = this;

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		//this.log.info("config option1: " + this.config.option1);
		//this.log.info("config option2: " + this.config.option2);

		if (typeof this.config.defaultconfig !== 'object') {
			try {
				this.config.defaultconfig = JSON.parse(this.config.defaultconfig)

			} catch (e) {
				this.log.error('Cannot parse defaultconfig: ' + this.config.defaultconfig);
			}
		}

		this.subscribeStates("*"); // yes, i really have to.
		this.subscribeObjects("*"); // yes, i really have to.

		/*
		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
		*/

		try {

		await adapter.buildObjectStorage();
		adapter.log.info("---- buildObjectStorageAsync FINISHED ----");


		//await adapter.createFrameObjectsNotExsistsAsync("0_userdata.0.example_state_4", adapter.config.defaultconfig);
		//await adapter.updateShadowObject("0_userdata.0.example_state_4");
		/*
		await adapter.createSceduleObjectsNotExsistsAsync("0_userdata.0.example_state", {
			 "su":{
		         "08:00":21,
		         "20:00":30,
		         "20:20":20
		      }
		});
        

		await adapter.createConfigObjectsNotExsistsAsync("0_userdata.0.example_state", {
		    "active":false,
		    "template":"min",
		    "overrideBehavior":"4 Hours",
		    "considerOffDays":true,
		    "onlyIfGuest":false,
		    "considerOwnRule":false,
		    "ownRule":"TEST\nNext Row\nther Row"
		});
		*/

		adapter.log.info("---- createFrameObject FINISHED ----");

		} catch(e) {
			adapter.log.error(e);
		}
		
		adapter.tickInterval = setInterval(function() {
			adapter.onTick(); // call the tick function for an initial value calculation
		}, 1000);

		adapter.log.info("---- ADAPTER FINISHED ----");
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			clearInterval(adapter.tickInterval);

			callback();
		} catch (e) {
			callback();
		}
	}

	onObjectChange(id, obj) {
		//this.log.info("onObjectChange: " + id + " -> " + (obj ? "changed" : "deleted"));

		if(this.foreignIDs.includes(id)) {
			// Todo: Was original Object changed or deleted: Handle this.
		} else if(state.from != "system.adapter." + this.namespace) { // ignore own changes
			this.updateShadowObject(this.stripFrameId(id));
		}
	}

	onStateChange(id, state) {
		//this.log.info("onStateChange: " + id + " -> " + (state ? "changed" : "deleted"));

		if(this.foreignIDs.includes(id)) {
			this.handleForeignStateChange(this.convertToFrameId(id), state);
		} else if(state.from != "system.adapter." + this.namespace) { // ignore own changes
			this.updateShadowObject(this.stripFrameId(id));
		}
	}

	onMessage(obj) {
		let adapter = this;


		adapter.log.info(JSON.stringify(obj));

		if (typeof obj === "object" && obj.message && obj.message.id) {
			if (typeof obj.message !== 'object') {
				try {
					obj.message = JSON.parse(obj.message)

				} catch (e) {
					this.log.error('Cannot parse message: ' + obj.message);
					this.sendTo(obj.from, obj.command, {error: 'Cannot parse message'}, obj.callback);
					return true;
				}
			}

			try {
				adapter.log.info(JSON.stringify(obj.message));

				switch(obj.command) {
					case "getObject":
						this.getObjectJSON(obj.message.id, function(err, result) {
							adapter.sendTo(obj.from, obj.command, result, obj.callback);
						});
						break;

					case "setObject":
						adapter.createFrameObjectsNotExsists(obj.message.id, obj.message.object, function(err, result) {
							adapter.sendTo(obj.from, obj.command, result, obj.callback);
							adapter.onTick();
						});
						break;

					case "setScedule":
						adapter.createSceduleObjectsNotExsists(obj.message.id, obj.message.scedule, function(err, result) {
							adapter.sendTo(obj.from, obj.command, result, obj.callback);
							adapter.onTick();
						});
						break;

					case "setConfig":
						adapter.createConfigObjectsNotExsists(obj.message.id, obj.message.config, function(err, result) {
							adapter.sendTo(obj.from, obj.command, result, obj.callback);
							adapter.onTick();
						});
						break;

				}
			} catch (e) {
				this.log.error(obj.command + ' faild' + obj.message);
				this.sendTo(obj.from, obj.command, {error: obj.command + ' faild'}, obj.callback);
				return true;
			}
		}		
	}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// Scedule Operations

	getDuration(t1, t2) {
	    var delta = Math.abs(t1 - t2) / 1000;
	    var days = Math.floor(delta / 86400);
	    delta -= days * 86400;
	    var hours = Math.floor(delta / 3600) % 24;
	    delta -= hours * 3600;
	    var minutes = Math.floor(delta / 60) % 60;
	    delta -= minutes * 60;
	    var seconds = delta % 60;

	    return [hours, minutes, seconds];
	}

    getTodaysSeconds(datetime) {
        const [hours, minutes, seconds] = this.getDuration(datetime, 0);
        
        return (hours * 60 + minutes) * 60 + seconds;
    }

    parseTimeString(timeStr) {
        if((timeStr.indexOf(":") > 0 && timeStr.length == 5)) {
        	return new Date('01 Jan 1970 ' + timeStr + ':00 GMT').getTime() / 1000;
        } else {  // is Astrotime string
        	timeStr = timeStr.split("|");

            return this.getTodaysSeconds(this.data.astrotimes[timeStr[0]].getTime()) + (timeStr[1] ? timeStr[1] * 60 : 0);
        }
    }
    
    getOrderedScedule(id, day, date) {
		var adapter = this;
        var scedule = adapter.objectStorage[id].data.scedule[day];
        var startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

        var sortable = [];
        
        if(!scedule) {
        	return sortable;
        }
    	
        Object.entries(scedule).forEach(([timeStr, value]) => {
        	let seconds = adapter.parseTimeString(timeStr);
            sortable.push([seconds, startOfDay + seconds * 1000, value]);
        });
        
        sortable.sort(function(a, b) {
            return a[0] - b[0];
        });
        
        return sortable;
    }
    

	getTodaysSceduleDay(id, date) {
		var adapter = this;
		let frameId = this.convertToFrameId(id);

		let mode = Object.keys(adapter.objectStorage[frameId].data.scedule).length; // 8, 3, 2;
		let days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
		let workdays = ["mo", "tu", "we", "th", "fr"];
		let today = days[date.getDay()];

		if(this.day == "off") { // ToDo: Handle off day
			return "off";
		} else {
			switch(mode) {
				case 8:
					return today;
					break;
				case 3:
					if(workdays.indexOf(today) > -1) {
						return "mo";
					} else {
						return "su";
					}
					break;
				case 2:
					return "mo";
					break;
			}
		}
	}

    findNextSceduleEntry(id, testdate) {
    	let date = testdate ? testdate : new Date();
    	let match;
    	let maxloop = 7;

    	while(!match) {
	    	let sceduleDay = this.getTodaysSceduleDay(id, date);
	    	let orderedScedule = this.getOrderedScedule(id, sceduleDay, date);
	    	let todaysSeconds = this.getTodaysSeconds(date);
	   		match = orderedScedule.find((s) => testdate.getTime() <= s[1]);
	   		date = new Date(date.getTime() + 86400000); // increase a day

	   		if(maxloop-- < 0) { this.log.error("MAXLOOP findNextSceduleEntry(" + id + ")"); return; }
   		}

    	return match ? match[2] : null;
    }

    findCurrentSceduleValue(id) {
    	let date = new Date();
    	let match;
    	let maxloop = 7;

    	while(!match) {
	    	let sceduleDay = this.getTodaysSceduleDay(id, date);
	    	let orderedScedule = this.getOrderedScedule(id, sceduleDay, date);
	    	let todaysSeconds = this.getTodaysSeconds(date);
	   		match = orderedScedule.reverse().find((s) => todaysSeconds >= s[0]);
	   		date = new Date(date.getTime() - 86400000); // reduce a day

	   		if(maxloop-- < 0) { this.log.error("MAXLOOP findCurrentSceduleValue(" + id + ")"); return; }
   		}

    	return match ? match[2] : null;
    }

    getPermittedOverwriteDate(id, date) {
    	switch(this.objectStorage[id]?.data.config.overrideBehavior) {
    		case "null":
    			return date;
    		case "1 Hour":
    			return date  + 1 * 60 * 60 * 1000;
    		case "2 Hours":
    			return date + 2 * 60 * 60 * 1000;
    		case "4 Hours":
    			return date  + 4 * 60 * 60 * 1000;
    		case "next change":
    			return findNextSceduleEntry(id, date);
    		default:
    			return date  + 24 * 60 * 60 * 1000;
    	}
    }

	onTick() {
		let adapter = this;
		
		// get astrotimes two times a day
		if( Date.now() > adapter.data.astrotimeUpdated + 12 * 60 * 60 * 1000 )
			this.data.astrotimes = suncalc.getTimes(new Date(), this.config.longitude , this.config.latitude);
			adapter.data.astrotimeUpdated = Date.now();
		}

		for (const [frameId, values] of Object.entries(this.objectStorage)) {
			let value = this.findCurrentSceduleValue(frameId);
			
			if(this.objectStorage[frameId].oval != value) {
				let lastChange = this.objectStorage[frameId].olc;
				let permittedOverwriteDate = this.getPermittedOverwriteDate(frameId, lastChange);

				if(Date.now() > permittedOverwriteDate) {
					this.log.info("CHANGE: " + frameId + " Value " + this.objectStorage[frameId].oval + " -> " + value);
					this.setForeignStateAsync(this.objectStorage[frameId].oid, value);
					this.objectStorage[frameId].oval = value;
					this.objectStorage[frameId].olc = Date.now();
					this.updateShadowObject(frameId);
				} else if (this.objectStorage[frameId].overwrittenFrom != lastChange) {
					this.objectStorage[frameId].overwrittenFrom = lastChange;
					this.objectStorage[frameId].overwrittenTill = permittedOverwriteDate;
					this.updateShadowObject(frameId);
				}
			} else if(this.objectStorage[frameId].val != value) {
				this.updateShadowObject(frameId);
			}

			this.objectStorage[frameId].val = value;

			if(this.objectStorage[frameId].overwrittenFrom && this.objectStorage[frameId].oval == value) {
				this.objectStorage[frameId].overwrittenFrom = null;
				this.objectStorage[frameId].overwrittenTill = null;
				this.updateShadowObject(frameId);
			}
		}
	}

// getCurrentSceduleDay
// getCurrentSceduleValue
// checkIfOverwritten

	async handleForeignStateChange(id, state) {
		let frameId = this.convertToFrameId(id);

		this.log.info("frameId: " + frameId);
		this.objectStorage[frameId].oval = state?.val;
		this.objectStorage[frameId].olc = state?.lc;

		this.onTick();
	}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// Data Operations

	convertToFrameId(id) {
		return id.replace(new RegExp("\\.", 'g'), "::");
	}

	stripFrameId(id) {
		id = id.replace(this.namespace + ".", "");
		id = id.slice(0, id.indexOf("."));

		return id;
	}

	async updateShadowObject(id) {
		var adapter = this;
		let frameId = this.convertToFrameId(id);

		if (adapter.objectStorage[frameId]) {
			let json = await adapter.buildFrameObjectJSON(frameId);
			adapter.objectStorage[frameId].data = json;
			adapter.objectStorage[frameId].lc = Date.now();

			// add object information
			json.object = {
				id: adapter.objectStorage[frameId].oid,
				val: adapter.objectStorage[frameId].oval,
				lc: adapter.objectStorage[frameId].olc,
				type: adapter.objectStorage[frameId].otype,
				isOffDay: adapter.objectStorage[frameId].isOffDay,
				overwrittenFrom: adapter.objectStorage[frameId].overwrittenFrom,
				overwrittenTill: adapter.objectStorage[frameId].overwrittenTill
			};

			adapter.setStateAsync(frameId + ".shadowstate", JSON.stringify(json));
		}
	}

	async buildObjectStorage() {
		var adapter = this;
		let result;

		try {
      		let obj = await adapter.getForeignObjectAsync("system.config");
			adapter.config.longitude = obj.common.longitude;
			adapter.config.latitude = obj.common.latitude;


			let states = await adapter.getStatesAsync("*.shadowstate");
		
			//Object.entries(states).forEach( await async ([state, value]) => {
			for (const [state, value] of Object.entries(states)) {
				let frameId = state.replace(adapter.namespace + ".", "").replace(".shadowstate", "");
				adapter.objectStorage[frameId] = {};

				let stat = await adapter.getStateAsync(frameId);
				//adapter.objectStorage[id].data = stat?.val;
				adapter.objectStorage[frameId].lc = stat?.lc;

				obj = await adapter.getObjectAsync(frameId);
				adapter.objectStorage[frameId].oid = obj?.common.name;
				adapter.foreignIDs.push(obj?.common.name);
				adapter.subscribeForeignStates(obj?.common.name);

				stat = await adapter.getForeignStateAsync(adapter.objectStorage[frameId].oid);
				adapter.objectStorage[frameId].oval = stat?.val;
				adapter.objectStorage[frameId].val = stat?.val;
				adapter.objectStorage[frameId].olc = stat?.lc;

				obj = await adapter.getForeignObjectAsync(adapter.objectStorage[frameId].oid);
				adapter.objectStorage[frameId].otype = obj?.common.type;

				adapter.objectStorage[frameId].isOffDay = false; // toDo: Handly Off Day
				adapter.objectStorage[frameId].overwrittenFrom = null;
				adapter.objectStorage[frameId].overwrittenTill = null;

				await adapter.updateShadowObject(frameId);
			}
		} catch (err) {
			adapter.log.error(err);
		}
	}

	buildObjectStorageAsync = tools.promisify(this.buildObjectStorage, this);

	async checkIfOriginObjectExsist(id) {
	    return await this.getForeignStateAsync(id);
	}

	async checkIfFrameObjectExsist(id) {
		let result = await this.getStateAsync(id);

	    return result;
	}

	bindOriginObject() {

	}

	async createOrUpdateStates(space, objectJSON) {
		let adapter = this;
		let stats = await adapter.getStatesAsync(space);
		let objectsToDelete = Object.keys(stats).map(s => s.replace(adapter.namespace + ".", ""));

		//objectJSON.forEach( async o => {
		for (const o of objectJSON) {
			let index = objectsToDelete.indexOf(o._id);

			if (index > -1) {
				objectsToDelete.splice(index, 1);
			}

			if(!await adapter.setObjectNotExistsAsync(o._id, o) && o._id.indexOf(".shadowstate") < 0) {
				let value = o.common.def;

				if(typeof value === "number" && o.common.type == "boolean") {
					value = true;
				} else if(typeof value === "boolean" && o.common.type == "number") {
					value = 0;
				} else if(typeof value === "string" && o.common.type == "number") {
					value = parseInt(value);
				} 

				await adapter.setStateAsync(o._id, value);
			}
		}

		for (const o of objectsToDelete) {
			await adapter.delObjectAsync(o);
		}
	}

	async createSceduleObjectsNotExsists(id, sceduleJSON, callback) {
		let adapter = this; 
		let frameId = this.convertToFrameId(id);
		let dataType = adapter?.objectStorage[frameId]?.otype;

		try {
			for (const [day, times] of Object.entries(sceduleJSON)) {
				let objects = [];

				for (const [time, value] of Object.entries(times)) {
					objects.push({
						_id: frameId + ".scedule." + day + "." + time,
						type: "state",
						common: {
							name: day + "." + time,
							type: dataType,
							role: "value",
							read: true,
							write: true,
							def: value
						},
						native: {}
					});
				};

				await adapter.createOrUpdateStates(frameId + ".scedule." + day + ".*", objects);
				adapter.objectStorage[frameId].data.scedule[day] = times;
			};
		} catch(e) {
			callback(e, null);
		}

		callback(null, true);
	}

	createSceduleObjectsNotExsistsAsync = tools.promisify(this.createSceduleObjectsNotExsists, this);


	async createConfigObjectsNotExsists(id, configJSON, callback) {
		let adapter = this; 
		let frameId = this.convertToFrameId(id);

		let objects = [];

		let configMap = {
			active: { type: "boolean", role: "state" },
			template: { type: "string", role: "state" },
			overrideBehavior: { type: "string", role: "state" },
			onlyIfGuest: { type: "boolean", role: "indicator" },
			considerOffDays: { type: "boolean", role: "indicator" },
			considerOwnRule: { type: "boolean", role: "indicator" },
			ownRule: { type: "string", role: "value" }
		};

		try {
			for (const [key, value] of Object.entries(configMap)) {
				let def = configJSON[key];

				objects.push({
					_id: frameId + ".config." + key,
					type: "state",
					common: {
						name: key,
						type: value.type,
						role: value.role,
						read: true,
						write: true,
						def: def
					},
					native: {}
				});
			}

			await adapter.createOrUpdateStates(frameId + ".config.*", objects);
			adapter.objectStorage[frameId].data.config = configJSON;
		} catch(e) {
			callback(e, null);
		}

		callback(null, true);
	}

	createConfigObjectsNotExsistsAsync = tools.promisify(this.createConfigObjectsNotExsists, this);

	async createFrameObjectsNotExsists(id, jsonData, callback) {
		let adapter = this;
		let frameId = this.convertToFrameId(id);

		if(!callback) {
			callback = function(err, result) { adapter.log.error(err); }
		}

		if(!jsonData) {
			jsonData = adapter.config.defaultconfig;
		}

		if(!adapter.objectStorage[frameId]) {
			let stat = await adapter.getForeignStateAsync(id);
			let obj = await adapter.getForeignObjectAsync(id);

			adapter.objectStorage[frameId] = {
				lc: new Date(),
				oid: id,
				oval: stat?.val,
				olc: stat?.lc,
				otype: obj?.common.type,
				isOffDay: false, // toDo: Handly Off Day
				overwrittenFrom: null,
				overwrittenTill: null
			};

			adapter.foreignIDs.push(obj?.common.name);
			adapter.subscribeForeignStates(obj?.common.name);
		}

		try {

			const objects = [{
				_id: frameId,
				type: "state",
				common: {
					name: id,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
					def: true
				},
				native: {}
			}];

			objects.push({
				_id: frameId + ".shadowstate",
				type: "state",
				common: {
					name: id,
					type: "json",
					role: "json",
					read: true,
					write: true
				},
				native: {}
			});
			
			for (const o of objects) {
				if(!await adapter.setObjectNotExistsAsync(o._id, o)) {
					//await adapter.setStateAsync(o._id, o.common.def);
				}
			}

			await adapter.createConfigObjectsNotExsistsAsync(id, jsonData.config);
			await adapter.createSceduleObjectsNotExsistsAsync(id, jsonData.scedule);
		} catch(e) {
			callback("createFrameObjectsNotExsists: " + e, null);

		}

		callback(null, true);
	}

	createFrameObjectsNotExsistsAsync = tools.promisify(this.createFrameObjectsNotExsists, this);

	async buildFrameObjectJSON(id) {
		let adapter = this;

		try {
			let frameId = this.convertToFrameId(id);
			let states = await adapter.getStatesAsync(frameId + ".*");

			let result = {
				config: {},
				scedule: {}
			}
			
			for (const [key, value] of Object.entries(states)) {
				var stateID = key.replace(adapter.namespace + "." + frameId + ".", "");

				if (stateID.startsWith("config.")) {
					stateID = stateID.replace("config.", "");
					result.config[stateID] = value?.val;
				}

				if (stateID.startsWith("scedule.")) {
					stateID = stateID.replace("scedule.", "");
					let timePart = String(stateID).split(".");

					if (!result.scedule[timePart[0]]) {
						result.scedule[timePart[0]] = {};
					}

					result.scedule[timePart[0]][timePart[1]] = value?.val;
				}
			}


			if(typeof callback !== "undefined") { callback(null, result); }

			return result;
		} catch(e) {
			adapter.log.error("buildFrameObjectJSON: " + e);
			if(typeof callback !== "undefined") { callback(e, null); }
		}

		if(typeof callback !== "undefined") { callback(null, null); }

		return {}
	}

	buildFrameObjectJSONAsync = tools.promisify(this.buildFrameObjectJSON, this);

	async getObjectJSON(id, callback) {
		let adapter = this;

		let frameId = this.convertToFrameId(id);
		let frameObjectExsists = false;
		let result = {};
		result.data = {};

		try {
			if(await adapter.checkIfOriginObjectExsist(id)) { // check for origin object
				if(! await adapter.checkIfFrameObjectExsist(frameId)) { // check for frame object
					await adapter.createFrameObjectsNotExsists(id, adapter.config.defaultconfig);
					await adapter.updateShadowObject(id);
				}

				if(await adapter.checkIfFrameObjectExsist(frameId)) { // check for frame object, again
					let objectJSON = adapter.objectStorage[frameId]; //await adapter.buildFrameObjectJSON(frameId);

					if (objectJSON) {
						result.status = "ok";
						result.message = "";

						result.data = objectJSON.data;

						result.data.object = {
							id: objectJSON.oid,
							val: objectJSON.oval,
							lc: objectJSON.olc,
							type: objectJSON.otype,
							isOffDay: objectJSON.isOffDay,
							overwrittenFrom: objectJSON.overwrittenFrom,
							overwrittenTill: objectJSON.overwrittenTill
						};

						result.data.astrotimedata = {
							"latitude": adapter.config.latitude,
							"longitude": adapter.config.longitude
						};

						result.data.shadowstate = "yellowframe." + adapter.instance + "." + frameId + ".shadowstate";
						result.data.adapterTime = new Date().getTime();
					} else {
						result.status = "error";
						result.message = "error while loading frame object";
					}
				} else {
					result.status = "error";
					result.message = "error while creating frame object";
				}
			} else {
				result.status = "error";
				result.message = "object id does not exsist";
			}

		} catch(e) {
			callback(e, result);
			adapter.log.error(e);
		}

		callback(null, result);

    return result;
	}

	getObjectJSONAsync = tools.promisify(this.getObjectJSON, this);

}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Yellowframe(options);
} else {
	// otherwise start the instance directly
	new Yellowframe();
}