'use strict';

/*
 * Created with @iobroker/create-adapter v2.0.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const tools = require(utils.controllerDir + '/lib/tools');
const helper = require('./lib/tools');
const suncalc = require('./widgets/yellowframe/js/suncalc');

const {callbackify} = require('util');

// Load your modules here, e.g.:
// const fs = require("fs");

class Yellowframe extends utils.Adapter {

	/**
	 * [constructor description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	constructor(options) {
		super({
			...options,
			name: 'yellowframe',
		});

		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		this.on('objectChange', this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));

		this.objectStorage = {};
		this.helperStates = {};
		this.foreignIDs = [];
		// This.config = {};
		this.data = {};
		this.data.astrotimeUpdated = 0;
	}

	/**
	 * [onReady description]
	 * @return {[type]} [description]
	 */
	async onReady() {
		// Initialize your adapter here
		const adapter = this;

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		// this.log.info("config option1: " + this.config.option1);
		// this.log.info("config option2: " + this.config.option2);

		if (typeof this.config.defaultConfig !== 'object') {
			try {
				this.config.defaultConfig = JSON.parse("{" + this.config.defaultConfig + "}");
			} catch (e) {
				this.log.error('Cannot parse defaultConfig: ' + this.config.defaultConfig);
			}
		}
		if (typeof this.config.defaultConfigNumber !== 'object') {
			try {
				this.config.defaultConfigNumber = JSON.parse("{" + this.config.defaultConfigNumber + "}");
			} catch (e) {
				this.log.error('Cannot parse defaultConfigNumber: ' + this.config.defaultConfigNumber);
			}
		}
		if (typeof this.config.defaultConfigBoolean !== 'object') {
			try {
				this.config.defaultConfigBoolean = JSON.parse("{" + this.config.defaultConfigBoolean + "}");
			} catch (e) {
				this.log.error('Cannot parse defaultConfigBoolean: ' + this.config.defaultConfigBoolean);
			}
		}
		if (typeof this.config.defaultSceduleNumber !== 'object') {
			try {
				this.config.defaultSceduleNumber = JSON.parse("{" + this.config.defaultSceduleNumber + "}");
			} catch (e) {
				this.log.error('Cannot parse defaultSceduleNumber: ' + this.config.defaultSceduleNumber);
			}
		}
		if (typeof this.config.defaultSceduleBoolean !== 'object') {
			try {
				this.config.defaultSceduleBoolean = JSON.parse("{" + this.config.defaultSceduleBoolean + "}");
			} catch (e) {
				this.log.error('Cannot parse defaultConfigBoolean: ' + this.config.defaultSceduleBoolean);
			}
		}

		//adapter.subscribeStates('*'); // yes, i really have to.
		//adapter.subscribeObjects('*'); // again .. yes, i really have to.

		if(!adapter.config.useOwnFields) {
			adapter.subscribeForeignStates(adapter.config.guestObject);
			adapter.subscribeForeignStates(adapter.config.offDayObject);
			adapter.subscribeForeignStates(adapter.config.dayAtHomeObject);
		} else {
			adapter.subscribeStates("isGuestActive");
			adapter.subscribeStates("isOffDay");
			adapter.subscribeStates("isDayAtHome");
		}

		/*
		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
		*/
	

		await adapter.createHelperObjectsNotExsists();

		try {
			await adapter.buildObjectStorage();
			adapter.log.info('---- buildObjectStorageAsync FINISHED ----');
		} catch (e) {
			adapter.log.error(e);
		}

		await adapter.onTick();

		adapter.tickInterval = setInterval(() => {
			adapter.onTick(); // Call the tick function for an initial value calculation
		}, 5000);

		adapter.log.info('---- ADAPTER FINISHED ----');
	}

	/**
	 * [onUnload description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	onUnload(callback) {
		try {
			clearInterval(adapter.tickInterval);

			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * [onObjectChange description]
	 * @param  {[type]} id  [description]
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	onObjectChange(id, obj) {
		// This.log.info("onObjectChange: " + id + " -> " + (obj ? "changed" : "deleted"));
		
 		// ignore own changes
		if (obj && obj.from && obj.from == 'system.adapter.' + this.namespace) {
			return
		}

		if (this.foreignIDs.includes(id)) {
			// Todo: Was original Object changed or deleted: Handle this.
		} else {
			this.log.info("onObjectChange->updateShadowObject");
			this.updateShadowObject(this.stripFrameId(id));
		}
	}

	/**
	 * [onStateChange description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	onStateChange(id, state) {
		// This.log.info("onStateChange: " + id + " -> " + (state ? "changed" : "deleted"));

		id = id.replace(this.namespace + '.', '');

		// ignore own changes
		if (state && state.from && state.from === 'system.adapter.' + this.namespace) {
			return
		}

		if(this.config.useOwnFields && id === "isGuestActive" || !this.config.useOwnFields && id === this.config.guestObject) {
			this.log.info("isGuestActive has changed");
			this.helperStates["isGuestActive"] = state?.val
			this.onTick();
		} else if(this.config.useOwnFields && id === "isOffDay" || !this.config.useOwnFields && id === this.config.offDayObject) {
			this.log.info("offDayObject has changed");
			this.helperStates["isOffDay"] = state?.val
			this.onTick();
		} else if(this.config.useOwnFields && id === "isDayAtHome" || !this.config.useOwnFields && id === this.config.dayAtHomeObject) {
			this.log.info("dayAtHomeObject has changed");
			this.helperStates["isDayAtHome"] = state?.val
			this.onTick();
		} else if (this.foreignIDs.includes(id)) {
			this.handleForeignStateChange(id, state);
		} else {

			this.log.info("onStateChange->updateShadowObject");
			this.updateShadowObject(this.stripFrameId(id));
		}
	}

	/**
	 * [onMessage description]
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	onMessage(obj) {
		const adapter = this;

		if (typeof obj === 'object' && obj.message && obj.message.id) {
			if (typeof obj.message !== 'object') {
				try {
					obj.message = JSON.parse(obj.message);
				} catch (e) {
					this.log.error('Cannot parse message: ' + obj.message);
					this.sendTo(obj.from, obj.command, {error: 'Cannot parse message'}, obj.callback);
					return true;
				}
			}

			try {
				switch (obj.command) {
				case 'getObject':
					this.getObjectJSON(obj.message.id, (err, result) => {
						adapter.sendTo(obj.from, obj.command, result, obj.callback);
					});
					break;

				case 'setObject':
					adapter.createFrameObjectsNotExsists(obj.message.id, obj.message.object, (err, result) => {
						adapter.sendTo(obj.from, obj.command, result, obj.callback);
						adapter.onTick();
					});
					break;

				case 'setScedule':
					adapter.createSceduleObjectsNotExsists(obj.message.id, obj.message.scedule, (err, result) => {
						adapter.sendTo(obj.from, obj.command, result, obj.callback);
						adapter.onTick();
					});
					break;

				case 'setConfig':
					adapter.createConfigObjectsNotExsists(obj.message.id, obj.message.config, (err, result) => {
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

	// / ////////////////////////////////////////////////////////////////////////////////////////////////
	// / ////////////////////////////////////////////////////////////////////////////////////////////////
	// / ////////////////////////////////////////////////////////////////////////////////////////////////

	// Scedule Operations

	/**
	 * [getDuration description]
	 * @param  {[type]} t1 [description]
	 * @param  {[type]} t2 [description]
	 * @return {[type]}    [description]
	 */
	getDuration(t1, t2) {
		let delta = Math.abs(t1 - t2) / 1000;
		const days = Math.floor(delta / 86400);
		delta -= days * 86400;
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;
		const minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;
		const seconds = parseInt(delta % 60);

		return [hours, minutes, seconds];
	}

	/**
	 * [getTodaysSeconds description]
	 * @param  {[type]} datetime [description]
	 * @return {[type]}          [description]
	 */
	getTodaysSeconds(datetime) {
		const [hours, minutes, seconds] = this.getDuration(datetime, 0);

		return (hours * 60 + minutes) * 60 + seconds;
	}

	/**
	 * [parseTimeString description]
	 * @param  {[type]} timeStr [description]
	 * @return {[type]}         [description]
	 */
	parseTimeString(timeStr) {
		if ((timeStr.indexOf(':') > 0 && timeStr.length == 5)) {
        	return new Date('01 Jan 1970 ' + timeStr + ':00 GMT+00:00').getTime() / 1000;
		} // Is Astrotime string

        timeStr = timeStr.split('|');

		return this.getTodaysSeconds(this.data.astrotimes[timeStr[0]].getTime()) + (timeStr[1] ? timeStr[1] * 60 : 0);
	}

	/**
	 * [getOrderedScedule description]
	 * @param  {[type]} id   [description]
	 * @param  {[type]} day  [description]
	 * @param  {[type]} date [description]
	 * @return {[type]}      [description]
	 */
    getOrderedScedule(id, day, date) {
        const adapter = this;
        const scedule = adapter.objectStorage[id].data.scedule[day];
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const sortable = [];

        if (!scedule) {
            return sortable;
        }

        Object.entries(scedule).forEach(([timeStr, value]) => {
            let seconds = adapter.parseTimeString(timeStr);

            if ((timeStr.indexOf(':') > 0 && timeStr.length == 5)) {
                sortable.push([seconds, startOfDay + seconds * 1000, value]);
            } else {
                timeStr = timeStr.split('|');
                let time = adapter.data.astrotimes[timeStr[0]].getTime() + (timeStr[1] ? timeStr[1] * 60 * 1000 : 0);
                sortable.push([seconds, time, value]);
            }
        });

        sortable.sort((a, b) => a[1] - b[1]);

        return sortable;
    }

	/**
	 * [getTodaysSceduleDay description]
	 * @param  {[type]} id   [description]
	 * @param  {[type]} date [description]
	 * @return {[type]}      [description]
	 */
	getTodaysSceduleDay(id, date) {
		const adapter = this;
		const frameId = this.convertToFrameId(id);

		const mode = adapter.objectStorage[frameId]?.data?.config.template; // 8, 3, 2;
		const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
		const workdays = ['mo', 'tu', 'we', 'th', 'fr'];
		const today = days[date.getDay()];

		if (adapter.helperStates["isOffDay"] && adapter.objectStorage[frameId]?.data?.config.considerOffDays || !adapter.helperStates["isGuestActive"] && adapter.objectStorage[frameId]?.data?.config.guestBehavior === 'off') { // ToDo: Handle off day
			return 'off';
		}

		if (adapter.helperStates["isGuestActive"] && adapter.objectStorage[frameId]?.data?.config.guestBehavior === 'guest') {
			return 'guest';
		}

		if (!adapter.helperStates["isGuestActive"] && adapter.objectStorage[frameId]?.data?.config.guestBehavior === 'inactive') {
			return 'inactive';
		}

		if (mode !== 'single' && adapter.helperStates["isDayAtHome"] && adapter.objectStorage[frameId]?.data?.config.considerDayAtHome ) {
			return 'su';
		}

		switch (mode) {
			case 'full':
				return today;
				break;
			case 'min':
				if (workdays.indexOf(today) > -1) {
					return 'mo';
				}

				return 'su';
				break;
			case 'single':
				return 'mo';
				break;
		}
	}

	/**
	 * [findNextSceduleEntry description]
	 * @param  {[type]} id       [description]
	 * @return {[type]}          [description]
	 */
	findNextSceduleEntry(id, testdate) {
    	let date = testdate || new Date();
    	let match;
    	let maxloop = 7;

    	while (!match) {
	    	const sceduleDay = this.getTodaysSceduleDay(id, date);
	    	const orderedScedule = this.getOrderedScedule(id, sceduleDay, date);
	   		match = orderedScedule.find(s => testdate.getTime() <= s[1]);
	   		date = new Date(date.getTime() + 86400000); // Increase a day

	   		if (maxloop-- < 0) {
				this.log.warn('MAXLOOP findNextSceduleEntry(' + id + ')'); return;
			}
   		}

    	return match ? match[1] : null;
	}

	/**
	 * [findCurrentSceduleValue description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	findCurrentSceduleValue(id, testdate) {
    	let date = testdate || new Date();
    	let match;
    	let maxloop = 7;

    	while (!match) {
	    	const sceduleDay = this.getTodaysSceduleDay(id, date);
	    	const orderedScedule = this.getOrderedScedule(id, sceduleDay, date);
	   		match = orderedScedule.reverse().find(s => testdate.getTime() >= s[1]);
	   		date = new Date(date.getTime() - 86400000); // Reduce a day

	   		if (maxloop-- <= 0) {
				this.log.warn('MAXLOOP findCurrentSceduleValue(' + id + ')'); return;
			}
   		}

    	return match ? match[2] : null;
	}

	/**
	 * [getPermittedOverwriteDate description]
	 * @param  {[type]} id   [description]
	 * @param  {[type]} date [description]
	 * @return {[type]}      [description]
	 */
	getPermittedOverwriteDate(id, date) {
    	switch (this.objectStorage[id]?.data.config.overrideBehavior) {
    		case 'force':
    			return date;
    		case '1 Minute':
    			return date +  1 * 60 * 1000;
    		case '2 Minutes':
    			return date + 2 * 60 * 1000;
    		case '5 Minutes':
    			return date + 5 * 60 * 1000;
    		case '10 Minutes':
    			return date + 10 * 60 * 1000;
    		case '30 Minutes':
    			return date + 30 * 60 * 1000;
    		case '1 Hour':
    			return date + 1 * 60 * 60 * 1000;
    		case '2 Hours':
    			return date + 2 * 60 * 60 * 1000;
    		case '4 Hours':
    			return date + 4 * 60 * 60 * 1000;
    		case 'next change':
    			return this.findNextSceduleEntry(id, new Date());
    		default:
    			return date + 24 * 60 * 60 * 1000;
    	}
	}

	/**
	 * [onTick description]
	 * @return {[type]} [description]
	 */
	onTick() {
		const adapter = this;

		// Get astrotimes two times a day
		if (Date.now() > adapter.data.astrotimeUpdated + 12 * 60 * 60 * 1000) {
			adapter.data.astrotimes = suncalc.getTimes(new Date(), this.config.latitude, this.config.longitude);
			adapter.data.astrotimeUpdated = Date.now();
		}

		// Loop known objects
		for (const [frameId, values] of Object.entries(adapter.objectStorage)) {
			let doShadowObjectUpdate = false;
			const sceduleDay = this.getTodaysSceduleDay(frameId, new Date());

			if (sceduleDay !== this.objectStorage[frameId].currentSceduleDay) {
				this.objectStorage[frameId].currentSceduleDay = sceduleDay;
				doShadowObjectUpdate |= true;
			}

			// Process only if object is active
			if (adapter.objectStorage[frameId]?.data?.config.active && sceduleDay !== 'inactive') {
				const value = this.findCurrentSceduleValue(frameId, new Date());

				if (typeof this.objectStorage[frameId].val === "undefined") {
					this.objectStorage[frameId].val = value;
				}

				// current value does not equal to the sceduled value
				if (adapter.objectStorage[frameId].oval != value && typeof value !== "undefined") {
					const lastChange = this.objectStorage[frameId].olc;
					const lastChangeByScript = this.objectStorage[frameId].ofrom === 'system.adapter.' + this.namespace
					const permittedOverwriteDate = this.getPermittedOverwriteDate(frameId, lastChange);

					// change the object if the permitted overwrite time is exeeded, or if the current scedue value has changed, or if the last change was from yellowframe itself
					if (Date.now() > permittedOverwriteDate || this.objectStorage[frameId].val !== value || lastChangeByScript) {
						this.log.info('CHANGE: ' + frameId + ' Value ' + this.objectStorage[frameId].oval + ' -> ' + value);
						this.setForeignStateAsync(adapter.objectStorage[frameId].oid, value);
						this.objectStorage[frameId].overwrittenFrom = null;
						this.objectStorage[frameId].overwrittenTill = null;
						this.objectStorage[frameId].oval = value;
						this.objectStorage[frameId].olc = Date.now();
						this.objectStorage[frameId].ofrom = 'system.adapter.' + this.namespace;
						this.objectStorage[frameId].updated = !lastChangeByScript;
						doShadowObjectUpdate |= true;
					} else if (this.objectStorage[frameId].overwrittenFrom != lastChange) {
						this.objectStorage[frameId].overwrittenFrom = lastChange;
						this.objectStorage[frameId].overwrittenTill = permittedOverwriteDate;
						this.objectStorage[frameId].updated = !lastChangeByScript;
						doShadowObjectUpdate |= true;
					}
				} else if (this.objectStorage[frameId].val !== value) {
					doShadowObjectUpdate |= true;
				}

				this.objectStorage[frameId].val = value;

				if (this.objectStorage[frameId].overwrittenFrom && this.objectStorage[frameId].oval == value) {
					this.objectStorage[frameId].overwrittenFrom = null;
					this.objectStorage[frameId].overwrittenTill = null;
					doShadowObjectUpdate |= true;
				}
			}

			// push update
			if (doShadowObjectUpdate) {
				this.updateShadowObject(frameId);
			}
		}
	}

	// GetCurrentSceduleDay
	// getCurrentSceduleValue
	// checkIfOverwritten

	/**
	 * [handleForeignStateChange description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	async handleForeignStateChange(id, state) {
		const frameId = this.convertToFrameId(id);
		
		this.objectStorage[frameId].oval = state?.val;
		this.objectStorage[frameId].olc = state?.lc;
		this.objectStorage[frameId].ofrom = state?.from;

		this.onTick();
	}

	// / ////////////////////////////////////////////////////////////////////////////////////////////////
	// / ////////////////////////////////////////////////////////////////////////////////////////////////
	// / ////////////////////////////////////////////////////////////////////////////////////////////////

	// Data Operations

	/**
	 * [convertToFrameId description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	convertToFrameId(id) {
		return id.replace(new RegExp('\\.', 'g'), '::');
	}

	/**
	 * [stripFrameId description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	stripFrameId(id) {
		id = id.replace(this.namespace + '.', '');
		id = id.slice(0, id.indexOf('.'));

		return id;
	}

	/**
	 * [updateShadowObject description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	async updateShadowObject(id) {
		const adapter = this;
		const frameId = this.convertToFrameId(id);

		try {
			if (adapter.objectStorage[frameId]) {
				const json = await adapter.buildFrameObjectJSON(frameId);
				adapter.objectStorage[frameId].data = json;
				adapter.objectStorage[frameId].lc = Date.now();

				// Add object information
				json.object = {
					id: adapter.objectStorage[frameId].oid,
					val: adapter.objectStorage[frameId].oval,
					lc: adapter.objectStorage[frameId].olc,
					type: adapter.objectStorage[frameId].otype,
					name: adapter.objectStorage[frameId].oname,
					currentSceduleDay: adapter.objectStorage[frameId].currentSceduleDay,
					isGuestActive: adapter.helperStates["isGuestActive"],
					isOffDay: adapter.helperStates["isOffDay"],
					updated: adapter.objectStorage[frameId].updated,
					overwrittenFrom: adapter.objectStorage[frameId].overwrittenFrom,
					overwrittenTill: adapter.objectStorage[frameId].overwrittenTill
				};

				if (adapter.objectStorage[frameId].data.config.guestBehavior === 'guest') {
				}

				if (adapter.objectStorage[frameId].data.config.considerOffDays) {
				}

				adapter.objectStorage[frameId].updated = false;
				Object.assign(json.object, adapter.helperStates);

				adapter.log.info("updateShadowObject " + frameId);
				adapter.setStateAsync(frameId + '.shadowstate', JSON.stringify(json));
			}
		} catch (err) {
			adapter.log.error("updateShadowObject: " + err);
		}
	}



	async buildSingleObjectStorage(frameId) {
		const adapter = this;

		try {
			adapter.objectStorage[frameId] = {};

			let state = await adapter.getStateAsync(frameId);
			// Adapter.objectStorage[id].data = state?.val;
			adapter.objectStorage[frameId].lc = state?.lc;

			let obj = await adapter.getObjectAsync(frameId);
			adapter.objectStorage[frameId].oid = obj?.common.name;
			adapter.foreignIDs.push(obj?.common.name);
			await adapter.subscribeForeignStates(obj?.common.name);

			state = await adapter.getForeignStateAsync(adapter.objectStorage[frameId].oid);
			adapter.objectStorage[frameId].oval = state?.val;
			adapter.objectStorage[frameId].olc = state?.lc;
			adapter.objectStorage[frameId].ofrom = state?.from;

			obj = await adapter.getForeignObjectAsync(adapter.objectStorage[frameId].oid);
			adapter.objectStorage[frameId].otype = obj?.common.type;
			adapter.objectStorage[frameId].oname = obj?.common.name;
			adapter.objectStorage[frameId].overwrittenFrom = null;
			adapter.objectStorage[frameId].overwrittenTill = null;

			adapter.objectStorage[frameId].data = await adapter.buildFrameObjectJSON(frameId) || {};
			adapter.objectStorage[frameId].currentSceduleDay = await adapter.getTodaysSceduleDay(frameId, new Date());
		} catch (err) {
			adapter.log.error('buildSingleObjectStorage: ' + err);
		}

		return adapter.objectStorage[frameId];
	}

	/**
	 * [buildObjectStorage description]
	 * @return {[type]} [description]
	 */
	async buildObjectStorage() {
		const adapter = this;

		try {
      		let obj = await adapter.getForeignObjectAsync('system.config');
			adapter.config.longitude = obj?.common.longitude;
			adapter.config.latitude = obj?.common.latitude;

			if(!adapter.config.useOwnFields) {
				let stat = adapter.getForeignStateAsync(adapter.config.guestObject);
				adapter.helperStates["isGuestActive"] = stat?.val
				stat = adapter.getForeignStateAsync(adapter.config.offDayObject);
				adapter.helperStates["isOffDay"] = stat?.val
			} else {
				let stat = adapter.getStateAsync("isGuestActive");
				adapter.helperStates["isGuestActive"] = stat?.val
				stat = adapter.getStateAsync("isOffDay");
				adapter.helperStates["isOffDay"] = stat?.val
			}

			const states = await adapter.getStatesAsync('*.shadowstate');

			// Object.entries(states).forEach( await async ([state, value]) => {
			for (const [state, value] of Object.entries(states)) {
				const frameId = state.replace(adapter.namespace + '.', '').replace('.shadowstate', '');
				await adapter.buildSingleObjectStorage(frameId);
				await adapter.updateShadowObject(frameId);
			}
		} catch (err) {
			adapter.log.error("buildObjectStorage: " + err);
		}
	}

	/**
	 * [createOrUpdateStates description]
	 * @param  {[type]} space      [description]
	 * @param  {[type]} objectJSON [description]
	 * @return {[type]}            [description]
	 */
	async createOrUpdateStates(space, objectJSON) {
		const adapter = this;
		const stats = space !== null ? await adapter.getStatesAsync(space) : [];
		const objectsToDelete = Object.keys(stats).map(s => s.replace(adapter.namespace + '.', ''));

		// ObjectJSON.forEach( async o => {
		for (const o of objectJSON) {
			const index = objectsToDelete.indexOf(o._id);

			if (index > -1) {
				objectsToDelete.splice(index, 1);
			}

			//if (typeof value !== "undefined") {
				if (!await adapter.setObjectNotExistsAsync(o._id, o) && o._id.indexOf('.shadowstate') < 0) {
					let value = o.common.def;

					if (typeof value === 'number' && o.common.type == 'boolean') {
						value = true;
					} else if (typeof value === 'boolean' && o.common.type == 'number') {
						value = 0;
					} else if (typeof value === 'string' && o.common.type == 'number') {
						value = parseInt(value);
					}

					await adapter.setStateAsync(o._id, value);
				}
			//}
		}

		for (const o of objectsToDelete) {
			await adapter.delObjectAsync(o);
		}
	}

	/**
	 * [createSceduleObjectsNotExsists description]
	 * @param  {[type]}   id          [description]
	 * @param  {[type]}   sceduleJSON [description]
	 * @param  {Function} callback    [description]
	 * @return {[type]}               [description]
	 */
	async createSceduleObjectsNotExsists(id, sceduleJSON) {
		const adapter = this;
		const frameId = this.convertToFrameId(id);
		const dataType = adapter?.objectStorage[frameId]?.otype;

		try {
			for (const [day, times] of Object.entries(sceduleJSON)) {
				const objects = [];

				for (const [time, value] of Object.entries(times)) {
					objects.push({
						_id: frameId + '.scedule.' + day + '.' + time,
						type: 'state',
						common: {
							name: day + '.' + time,
							type: dataType,
							role: 'value',
							read: true,
							write: true,
							def: value,
						},
						native: {},
					});
				}

				await adapter.createOrUpdateStates(frameId + '.scedule.' + day + '.*', objects);
				adapter.objectStorage[frameId].data.scedule[day] = times;
			}
		} catch (e) {
			adapter.log.error('createSceduleObjectsNotExsists (' + frameId + '): ' + e)
		}
	}

	/**
	 * [createConfigObjectsNotExsists description]
	 * @param  {[type]}   id         [description]
	 * @param  {[type]}   configJSON [description]
	 * @param  {Function} callback   [description]
	 * @return {[type]}              [description]
	 */
	async createConfigObjectsNotExsists(id, configJSON) {
		const adapter = this;
		const frameId = this.convertToFrameId(id);

		const objects = [];

		const configMap = {
			active: {type: 'boolean', role: 'state'},
			template: {type: 'string', role: 'state'},
			overrideBehavior: {type: 'string', role: 'state'},
			guestBehavior: {type: 'string', role: 'state'},
			considerOffDays: {type: 'boolean', role: 'indicator'},
			considerDayAtHome: {type: 'boolean', role: 'indicator'},
			considerOwnRule: {type: 'boolean', role: 'indicator'},
			ownRule: {type: 'string', role: 'value'},
			dataRole: {type: 'string', role: 'value'},
			dataSign: {type: 'string', role: 'value'},
			dataMin: {type: 'string', role: 'value'},
			dataMax: {type: 'string', role: 'value'}
		};

		try {
			for (const [key, value] of Object.entries(configMap)) {
				const def = configJSON[key];

				objects.push({
					_id: frameId + '.config.' + key,
					type: 'state',
					common: {
						name: key,
						type: value.type,
						role: value.role,
						read: true,
						write: true,
						def,
					},
					native: {},
				});
			}

			await adapter.createOrUpdateStates(frameId + '.config.*', objects);
			adapter.objectStorage[frameId].data.config = configJSON;
		} catch (e) {
			adapter.log.error('createConfigObjectsNotExsists (' + frameId + '): ' + e)
		}
	}

	/**
	 * [createFrameObjectsNotExsists description]
	 * @param  {[type]}   id       [description]
	 * @param  {[type]}   jsonData [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	async createFrameObjectsNotExsists(id, jsonData) {
		const adapter = this;
		const frameId = this.convertToFrameId(id);

		try {
			let stat = await adapter.getForeignStateAsync(id);
			let obj = await adapter.getForeignObjectAsync(id);

			if (!adapter.objectStorage[frameId]) {
				adapter.objectStorage[frameId] = {
					lc: new Date(),
					oid: id,
					oval: stat?.val,
					olc: stat?.lc,
					otype: obj?.common.type,
					oname: obj?.common.name,
					isOffDay: false, // ToDo: Handly Off Day
					overwrittenFrom: null,
					overwrittenTill: null,
				};

				adapter.foreignIDs.push(obj?.common.name);
				adapter.subscribeForeignStates(obj?.common.name);
			}

			if (!jsonData) {
				jsonData = {
					config: adapter.config.defaultConfig,
					scedule: {}
				};

				if (obj?.common.type === "number") {
					Object.assign(jsonData.config, adapter.config.defaultConfigNumber);
					Object.assign(jsonData.scedule, adapter.config.defaultSceduleNumber);
				} else {
					Object.assign(jsonData.config, adapter.config.defaultConfigBoolean);
					Object.assign(jsonData.scedule, adapter.config.defaultSceduleBoolean);
				}
			}

			const objects = [{
				_id: frameId,
				type: 'state',
				common: {
					name: id,
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
					def: true,
				},
				native: {},
			}];

			objects.push({
				_id: frameId + '.shadowstate',
				type: 'state',
				common: {
					name: id,
					type: 'json',
					role: 'json',
					read: true,
					write: true,
				},
				native: {},
			});

			for (const o of objects) {
				if (!await adapter.setObjectNotExistsAsync(o._id, o)) {
					// Await adapter.setStateAsync(o._id, o.common.def);
				}
			}

			await adapter.createConfigObjectsNotExsists(id, jsonData.config);
			await adapter.createSceduleObjectsNotExsists(id, jsonData.scedule);
		} catch (e) {
			adapter.log.error('createFrameObjectsNotExsists (' + frameId + '): ' + e)

			return false;
		}

		return true
	}

	async createHelperObjectsNotExsists(callback) {
		const adapter = this;

		if (typeof callback === 'undefined') {
			callback = function (err, result) {
				if (err) {
					adapter.log.error("createHelperObjectsNotExsists: " + err);
				}
			}
		}

		const objects = [];

		const configMap = {
			isOffDay: {type: 'boolean', role: 'indicator'},
			isGuestActive: {type: 'boolean', role: 'indicator'},
			isDayAtHome: {type: 'boolean', role: 'indicator'}
		};

		try {
			for (const [key, value] of Object.entries(configMap)) {
				objects.push({
					_id: key,
					type: 'state',
					common: {
						name: key,
						type: value.type,
						role: value.role,
						read: true,
						write: true,
						def: false,
					},
					native: {},
				});
			}

			await adapter.createOrUpdateStates(null, objects);
		} catch (e) {
			adapter.log.error('createHelperObjectsNotExsists (' + frameId + '): ' + e)
		}
	}

	/**
	 * [buildFrameObjectJSON description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	async buildFrameObjectJSON(id) {
		const adapter = this;

		try {
			const frameId = this.convertToFrameId(id);
			const states = await adapter.getStatesAsync(frameId + '.*');

			const result = {
				config: {},
				scedule: {},
			};

			for (const [key, value] of Object.entries(states)) {
				let stateID = key.replace(adapter.namespace + '.' + frameId + '.', '');

				if (stateID.startsWith('config.')) {
					stateID = stateID.replace('config.', '');
					result.config[stateID] = value?.val;
				}

				if (stateID.startsWith('scedule.')) {
					stateID = stateID.replace('scedule.', '');
					const timePart = String(stateID).split('.');

					if (!result.scedule[timePart[0]]) {
						result.scedule[timePart[0]] = {};
					}

					result.scedule[timePart[0]][timePart[1]] = value?.val;
				}
			}

			if (typeof callback !== 'undefined') {
				callback(null, result);
			}

			return result;
		} catch (e) {
			adapter.log.error('buildFrameObjectJSON: ' + e);

			if (typeof callback !== 'undefined') {
				callback(e, null);
			}
		}

		if (typeof callback !== 'undefined') {
			callback(null, null);
		}

		return {};
	}

	/**
	 * [checkIfOriginObjectExsist description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	async checkIfOriginObjectExsist(id) {
	    return await this.getForeignStateAsync(id);
	}

	/**
	 * [checkIfFrameObjectExsist description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	async checkIfFrameObjectExsist(id) {
	    return await this.getStateAsync(id);
	}

	/**
	 * [getObjectJSON description]
	 * @param  {[type]}   id       [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	async getObjectJSON(id, callback) {
		const adapter = this;

		const frameId = this.convertToFrameId(id);
		const frameObjectExsists = false;
		const result = {};
		result.data = {};

		try {
			if (await adapter.checkIfOriginObjectExsist(id)) { // Check for origin object
				if (!await adapter.checkIfFrameObjectExsist(frameId)) { // Check for frame object
					adapter.log.info("Create?")
					await adapter.createFrameObjectsNotExsists(id);
					await adapter.updateShadowObject(id);
				}

				if (await adapter.checkIfFrameObjectExsist(frameId)) { // Check for frame object, again
					let objectJSON = adapter.objectStorage[frameId];

					if(!objectJSON) {
						adapter.log.warn('getObjectJSON -> objectStorage for ' + frameId + ' does not exsist');
						objectJSON = await adapter.buildSingleObjectStorage(frameId);
					}

					if (objectJSON) {
						result.status = 'ok';
						result.message = '';

						result.data = objectJSON?.data;

						result.data.object = {
							id: objectJSON.oid,
							val: objectJSON.oval,
							lc: objectJSON.olc,
							type: objectJSON.otype,
							name: objectJSON.oname,
							currentSceduleDay: objectJSON.currentSceduleDay,
							isGuestActive: adapter.helperStates["isGuestActive"],
							isOffDay: adapter.helperStates["isOffDay"],
							overwrittenFrom: objectJSON.overwrittenFrom,
							overwrittenTill: objectJSON.overwrittenTill
						};

						result.data.astrotimedata = {
							latitude: adapter.config.latitude,
							longitude: adapter.config.longitude,
						};

						result.data.shadowstate = 'yellowframe.' + adapter.instance + '.' + frameId + '.shadowstate';
						result.data.adapterTime = new Date().getTime();
					} else {
						result.status = 'error';
						result.message = 'error while loading frame object';
					}
				} else {
					result.status = 'error';
					result.message = 'error while creating frame object';
				}
			} else {
				result.status = 'error';
				result.message = 'object id does not exsist';
			}
		} catch (e) {
			callback(e, result);
			adapter.log.error('getObjectJSON ' + e);
			result.status = 'error';
			result.message = 'catch: ' + e;
		}

		callback(null, result);

		return result;
	}
}

if (require.main !== module) {
	module.exports = options => new Yellowframe(options);
} else {
	// Otherwise start the instance directly
	new Yellowframe();
}
