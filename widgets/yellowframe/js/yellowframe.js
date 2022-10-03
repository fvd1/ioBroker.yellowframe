/*
    ioBroker.vis yellowframe Widget-Set

    version: "0.0.1"

    Copyright 2022 fvd1 frederik@von-dieken.de
*/
'use strict';


$(function() {
// add translations for edit mode
	$.extend(
		true,
		systemDictionary,
		{
			"value_overwritten_until": {"en": "Value Overwritten until", "de": "Überschrieben bis"},
			"msg_long_click": {"en": "long click to open the configuration", "de": "Lange klicken um die Einstellungen zu öffnen"},
			"timeline": {"en": "Timeline", "de": "Zeitstrahl"},
			"sceduleconfiguration": {"en": "Scedule configuration", "de": "Zeiten Einstellung"},
			"configuration": {"en": "Configuration", "de": "Einstellungen"},
			"min": {"en": "min", "de": "Min"},
			"off": {"en": "Day off", "de": "Außerhalb"},
			"guest": {"en": "Guest", "de": "Gast"},
			"inactive": {"en": "Inactive", "de": "Nicht aktiv"},
			"mo": {"en": "Monday", "de": "Montag"},
			"tu": {"en": "Tuesday", "de": "Dienstag"},
			"we": {"en": "Wednesday", "de": "Mittwoch"},
			"th": {"en": "Thursday", "de": "Donnerstag"},
			"fr": {"en": "Friday", "de": "Freitag"},
			"sa": {"en": "Saturday", "de": "Samstag"},
			"su": {"en": "Sunday", "de": "Sonntag"},
			"workday": {"en": "Workday", "de": "Werktag"},
			"weekend": {"en": "Weekend", "de": "Wochenende"},
			"everyday": {"en": "Everyday", "de": "Jeder Tag"},
			"value": {"en": "Value", "de": "Wert"},
			"shift_min": {"en": "Shift (min)", "de": "Verschiebung (Minuten)"},
			"time": {"en": "Time", "de": "Zeit"},
			"astrotime": {"en": "Astrotime", "de": "Astronomische Zeit"},
			"copy": {"en": "Copy", "de": "Kopieren"},
			"paste": {"en": "Paste", "de": "Einfügen"},
			"active": {"en": "Active", "de": "Aktiv"},
			"on": {"en": "On", "de": "An"},
			"off": {"en": "Off", "de": "Aus"},
			"choose_your_option": {"en": "Choose your option", "de": "Wähle eine Option"},
			"full_week": {"en": "Full week", "de": "Volle Woche (Mo-So)"},
			"workdays_Weekend": {"en": "Workday and Weekend", "de": "Werktag und Wochenende"},
			"single_day": {"en": "Single day", "de": "Einzelner Tag (jeder Wochtag ist gleich)"},
			"template": {"en": "Template", "de": "Template"},
			"force_scedule": {"en": "force scedule", "de": "Zeitplan erzwingen"},
			"minute": {"en": "Minute", "de": "Minute"},
			"minutes": {"en": "Minutes", "de": "Minuten"},
			"hour": {"en": "Hour", "de": "Stunde"},
			"hours": {"en": "Hours", "de": "Stunden"},
			"next_change": {"en": "Next change", "de": "Bis zum nächsten Event"},
			"overwrite_behavier": {"en": "Overwrite behavier", "de": "Verhalten bei Überschreibung des Zeitplans"},
			"consider_day_at_home_uses_sunday_scedule": {"en": "Consider day at Home (Uses Sunday scedule)", "de": "Feld (Tag Zuhause) berücksichtigen (Aktiviert Sonn und Feiertag)"},
			"consider_off_days": {"en": "Consider off-Day", "de": "Berücksichtige Tag Außerhalb"},
			"consider_own_rule": {"en": "Consider own rule", "de": "Berücksichtige die eigene Regel"},
			"own_rule": {"en": "Own rule", "de": "Eigene Regel (Script)"},
			"guest_behavier": {"en": "Guest behavier", "de": "Berücksichtigung bei Gast"},
			"do_not_consider_guest": {"en": "Do no consider guest", "de": "Nicht berücksichten"},
			"inactive_if_not_guest": {"en": "Schedule inactive until guest present", "de": "Zeitplan nur bei Gast aktiven, sonst inaktiv"},
			"off_day_if_not_guest": {"en": "If no guest is present use off day", "de": "Zeitplan nur bei Gast aktiven, sonst Tag Außerhalb nutzen"},
			"own_guest_scedule": {"en": "Use own guests schedule, otherwise normal scedule", "de": "Eigenen Zeitplan für Gast nutzen"},
			"data_type": {"en": "Data type", "de": "Daten Typ"},
			"number": {"en": "Number", "de": "Nummerisch"},
			"boolean": {"en": "Boolean", "de": "Binär (wahr/falsch)"},
			"custom": {"en": "Custom", "de": "Angepasst"},
			"value": {"en": "Value", "de": "Wert"},
			"percent": {"en": "Percent", "de": "Prozent"},
			"heat": {"en": "Heat", "de": "Heizung"},
			"data_sign": {"en": "Data sign", "de": "Daten Einheit"},
			"min_value": {"en": "Min value", "de": "Minimum Wert"},
			"max_value": {"en": "Max value", "de": "Maximum Wert"},
			"open": {"en": "open", "de": "offen"},
			"closed": {"en": "closed", "de": "geschlossen"},
			"start": {"en": "Start", "de": "Start"},
			"stop": {"en": "Stop", "de": "Stop"},
			"true": {"en": "True", "de": "wahr"},
			"false": {"en": "False", "de": "falsch"},
			"value_name_false": {"en": "False value name", "de": "Bezeichnung für wahr"},
			"value_name_true": {"en": "True value name", "de": "Bezeichnung für falsch"},
			"adapter": {"en": "Adapter", "de": "Adapter"},
			"optional_off": {"en": "(optional) Day off", "de": "(optional) Zeitplan für Tag außerhalb "},
			"optional_guest": {"en": "(optional) guest scedule", "de": "(Optional) Gast Zeitplan"},
			"sunrise": {"en": "Sunrise", "de": "Sonnenaufgang"},
			"sunset": {"en": "Sunset", "de": "Sonnenuntergang"},
			"sunriseEnd": {"en": "Sunrise end", "de": "Ende des Sonnenaufgangs"},
			"sunsetStart": {"en": "Sunset start", "de": "Begin des Sonnenuntergang"},
			"dawn": {"en": "Dawn", "de": "Morgendämmerung"},
			"dusk": {"en": "Dusk", "de": "Abenddämmerung"},
			"nauticalDawn": {"en": "Nautical Dawn", "de": "nautische Dämmerung"},
			"nauticalDusk": {"en": "Nautical Dusk", "de": "nautische Abenddämmerung"},
			"nightEnd": {"en": "Night End", "de": "Ende der Nacht"},
			"night": {"en": "Night", "de": "Nacht"},
			"goldenHourEnd": {"en": "Golden Hour end", "de": "Ende der goldenen Stunde"},
			"goldenHour": {"en": "Golden Hour", "de": "Goldene Stunde"}
		}
	);

    
    
	/**
	 * @param t1
	 * @param t2
	 * @example
	 */
	function getDuration(t1, t2) {
		var delta = Math.abs(t1 - t2) / 1000;
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;
		var minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;
		var seconds = parseInt(delta % 60);  // in theory the modulus is not required    

		return [hours, minutes, seconds];
	}

    
	class Viewclass {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.$html;
			this.data = {};
		}
    
		parent() {
			return this.parent;
		}
    
		updateData(data) {
			this.data = data;
		}
    
		buildHTML() {
			return $('');
		}
    
		updateView() {
			$('div', this.$html).replaceWith(this.buildHTML(this.day));
			this.postRenderAction();
		}
    
		postRenderAction() {
        
		}
    
		destroy() {
        
		}
    
		render($container, day) {
			let view = this;
			this.day = day;
        
			if (!this.$html || !this.$html.length) {
				this.$html = $('<div></div>');
				this.$html.append(this.buildHTML());
				$container.append(this.$html);
			} else {
				$('div', this.$html).replaceWith(this.buildHTML());
			}
        
			this.postRenderAction();
		}
	}   

    
	class yellowframe_Viewclass_frame {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
		}
    
		getParent() {
			return this.parent;
		}
    
		updateData(data) {
			this.object = data.object;
			this.config = data.config;
			this.adapter = data.adapter;
		}
    
		buildClockIcon() {
			var html = '';

			html += '<svg class="clock" viewBox="-100 -100 200 200">';
			html += '  <defs>';
			html += '    <line id="index" x1="55" y1="0" x2="65" y2="0" />';
			html += '  </defs>';
			html += '  <circle id="clockface" r="80"  />';
			html += '  <g id="indizes">';
			html += '    <use xlink:href="#index" transform="rotate(0)" />';
			html += '    <use xlink:href="#index" transform="rotate(30)" />';
			html += '    <use xlink:href="#index" transform="rotate(60)" />';
			html += '    <use xlink:href="#index" transform="rotate(90)" />';
			html += '    <use xlink:href="#index" transform="rotate(120)" />';
			html += '    <use xlink:href="#index" transform="rotate(150)" />';
			html += '    <use xlink:href="#index" transform="rotate(180)" />';
			html += '    <use xlink:href="#index" transform="rotate(210)" />';
			html += '    <use xlink:href="#index" transform="rotate(240)" />';
			html += '    <use xlink:href="#index" transform="rotate(270)" />';
			html += '    <use xlink:href="#index" transform="rotate(300)" />';
			html += '    <use xlink:href="#index" transform="rotate(330)" />';
			html += '  </g>';
			html += '  <line class="hand" id="hours" x1="0" y1="0" x2="0" y2="-35" />';
			html += '  <line class="hand" id="minutes" x1="0" y1="0" x2="0" y2="-65" />';
			html += '  <circle id="origin" r="2" />';
			html += '</svg>';

			return $(html);
		}
    
		buildOwerwrittenIcon() {
			var html = '';
			html += '<svg viewBox="-100 -100 200 200">';
			html += '  <circle id="clockface" r="80"  />';
			html += '</svg>';
			return $(html);
		}
    
		buildOffIcon() {
			var html = '';
			html += 'power_settings_new';
			return $(html);
		}
    
		buildNoConnectionIcon() {
			var html = '';
			html += '<svg viewBox="-100 -100 200 200">';
			html += '  <circle id="clockface" r="80"  />';
			html += '</svg>';
			return $(html);
		}
        
        getDurationString(duration) {
            if (duration[0] > 0) {
               return  duration[0] + 'h' + duration[1] + 'm';
            } else if (duration[1] > 9) {
                return duration[1] + 'm';
            } else if (duration[1] > 0) {
                return duration[1] + 'm' + duration[2] + 's';
            } else {
                return duration[2] + 's';
            }
        }

		buildHTML() {
			var html = '';

			if (this.object?.sync) {
				html += '<div class="updateIcon"></div>';
				this.getParent().getContainer().addClass('updated');
			}

			html += '<div class="control tooltip ' + (this.object?.sync ? "updated" : "") + '" data-position="right" data-tooltip="long click to open the configuration">';



			if(this.adapter.status === 'connecting') {
				html += '<a class="pulse btn-floating btn waves-effect waves-light grey"><i class="large material-icons ">portable_wifi_off</i></a>';
			} else if (this.adapter.status === 'offline') {
				html += '<a class="pulse btn-floating btn waves-effect waves-light red"><i class="large material-icons ">portable_wifi_off</i></a>';
				this.getParent().getContainer().removeClass('active').removeClass('inactive').addClass('offline');
			} else if (this.config?.active === false || this.getParent().getTodaysSceduleDay() === 'inactive') {
				html += '<a class="btn-floating btn waves-effect waves-light grey"><i class="large material-icons ">power_settings_new</i></a>';
				this.getParent().getContainer().removeClass('active').addClass('inactive').removeClass('offline');
			} else if (this.object?.overwrittenTill) {
				let duration = getDuration(this.object.overwrittenTill, new Date());
                html += '<a class="pulse btn-floating btn waves-effect waves-light red"><span class="duration" data-till="' + this.object.overwrittenTill + '">' + this.getDurationString(duration) + '</a>';
			    this.getParent().getContainer().addClass('active').removeClass('inactive').removeClass('offline');
            } else if (this.object.updated && this.config.overrideBehavior === 'force') {
				html += '<a class="pulse forced btn-floating btn waves-effect waves-light red"><i class="large material-icons ">lock_outline</i></a>';
                this.getParent().getContainer().addClass('active').removeClass('inactive').removeClass('offline');
            } else {
				html += '<a class="pulse btn-floating btn waves-effect waves-light yellow"><i class="large material-icons ">access_time</i></a>';
				this.getParent().getContainer().addClass('active').removeClass('inactive').removeClass('offline');
			}
        
            // 

			html += '</div>';

			return html;
		}
    
		destroy() {
			clearInterval(this.timer);
		}
    
		updateView() {
			if (!this.$html) return;

			this.$html.html(this.buildHTML());
			this.postRenderAction();
		}
    
        pauseEvent(e) {
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;

            return false;
        }

		postRenderAction() {
			try {
				var view = this;
				var timer = null;
				var timer2 = null;
				var pressStatus = 0;
	        
				if(!this.object) {
					return
				}
	        
				if (this.object.overwrittenTill) {
					let $durationElem = $('.duration', this.$html);
					let time = $durationElem.attr('date-till');

					this.timer = setInterval(function(){
						let duration = getDuration(view.object.overwrittenTill, new Date().getTime());

	                    $durationElem.html(view.getDurationString(view.object.overwrittenTill > new Date().getTime() ? duration : [0, 0, 0]));
					}, 1000);
				}
	        
				let $control = $('.control', this.$html);
				let dtFormater = new Intl.DateTimeFormat('de', {year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });
	        

	            if(view.object?.sync) {
	                timer2 = setTimeout(function(){
	                    view.object.sync = false;
	                    view.object.updated = false;
						view.getParent().getContainer().removeClass('updated');

	                    return view.updateView();
	                }, 2000);
	            }

				$control.on('mouseenter', function(e) {
					if(view.object.overwrittenTill) {
						$control.attr('data-tooltip', _('value_overwritten_until') + ': ' + dtFormater.format(new Date(view.object.overwrittenTill)));

						var instance = M.Tooltip.init($control[0], {
							enterDelay: 0
						});

						instance.open();
					}
				}).on('mousedown touchstart', function(e) {
					pressStatus = 1;
					var instance;
					timer = setTimeout(function(){
						pressStatus = 2;
	                
						if(view.editable) {
							view.parent.route('collabsible', true, null, 'modal');
							view.parent.route('timeline', true, null, 'collabsible:0', true);
							view.parent.route('configuration', true, null, 'collabsible:1');
						} else {
							view.parent.route('collabsible', false, null, 'modal');
							view.parent.route('timeline', false, null, 'collabsible:0', true);
						}
					}, 500);

	                e = e || window.event;
	                view.pauseEvent(e);

				}).on('mouseup mouseleave touchend', function(e) {
					clearTimeout(timer);
	            
					if(pressStatus == 1) {
						$control.attr('data-tooltip', _('msg_long_click'));

						var instance = M.Tooltip.init($control[0], {
							enterDelay: 0
						});

						instance.open();
					}
	            
					pressStatus = 0;
				});
			} catch (e) {
				console.error("yellowframe_Viewclass_frame->postRenderAction()" + e);
			}
		}
    
		render($container, editable) {
			this.editable = editable;
			let view = this;
        
			if (!this.$html || !this.$html.length) {
				this.$html = $('<div></div>');
				this.$html.append(this.buildHTML());
				$container.append(this.$html);
			} else {
				this.$html.html(this.buildHTML());
			}
        
			this.postRenderAction();
			$container.addClass('yellowframe');
		}
	}


	class yellowframe_Viewclass_Timeline {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.scedule;
			this.data;
			this.day;
			this.$scalar;
			this.$data;
			this.$wrapper;
			this.$html;
			this.singleView = true;
			this.todayView = false;

			this.stepWidth = parseInt(viewconfig.valueBoxWidth / viewconfig.dayHourTill - viewconfig.dayHourFrom / viewconfig.dayHourStep);
			this.stepHeight = viewconfig.valueBoxHeight - (viewconfig.valueBoxPadding * 2);
		}

		getParent() {
			return this.parent;
		}
    
		updateData(data) {
			this.scedule = data.scedule;
			this.object = data.object;
			this.config = data.config;
		}
    
		getHorizontalPosition(seconds) {
			var viewFrom = this.viewconfig.dayHourFrom * 60 * 60;
			var viewTill = this.viewconfig.dayHourTill * 60 * 60;

			if (seconds < viewFrom || seconds > viewTill) {
				return null;
			} else {
				return this.viewconfig.valueBoxWidth / (viewTill - viewFrom) * seconds;
			}
		}
    
		getVerticalPosition(value) {
			value = value > parseInt(this.config.dataMax) ? parseInt(this.config.dataMax) : value;
			value = value < parseInt(this.config.dataMin) ? parseInt(this.config.dataMin) : value;
        
			return (this.viewconfig.valueBoxHeight - this.viewconfig.valueBoxPadding * 2) - ((this.viewconfig.valueBoxHeight - this.viewconfig.valueBoxPadding * 2) / (parseInt(this.config.dataMax) - parseInt(this.config.dataMin))) * (value - parseInt(this.config.dataMin));
		}        
    
		parseTimeString(timeStr) {
			if(timeStr.indexOf(':') <= 0) {
				timeStr = timeStr.split('|');
				timeStr = new Date(this.getParent().astrotimes[timeStr[0]].getTime() + (timeStr[1] ?  timeStr[1] * 60 * 1000 : 0)).toLocaleTimeString('de-de', {hour: '2-digit', minute: '2-digit'});
			}
        
			return timeStr;
		}
    
		lastDaysValue() {
			let mode = Object.keys(this.scedule).length; // 8, 3, 2;
			let days = ['off'];
			let value = 0;
        
			if (this.day === 'off' || this.day === 'guest') {
				days = [this.day];
			} else {
				switch(mode) {
					case 8:
						days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
						break;
					case 3:
						days = ['mo', 'su'];
						break;
					case 2:
						days = ['mo'];
						break;
				}
			}
        
			let index = days.findIndex((d) => d == this.day);
			let lastDay = index - 1 < 0 ? days.length - 1 : index - 1;
			let lastSceduleDay = this.getOrderedScedule(lastDay);
			value = lastSceduleDay[lastSceduleDay.length - 1];

			return value ? value[3] : 0;
		}
    
		getOrderedScedule(day) {
			let view = this;
			var scedule = this.scedule[this.day];
			var sortable = [];
        
            if (!scedule) {
                return sortable;
            }

			Object.entries(scedule).forEach(([timeStr, value]) => {
				let isAstro = !(timeStr.indexOf(':') > 0 && timeStr.length == 5);
				let timeStr2 = view.parseTimeString(timeStr);
				let time = new Date('01 Jan 1970 ' + timeStr2 + ':00 GMT').getTime() / 1000;
            
				timeStr = timeStr.split('|');
            
				if(!isAstro) {
					timeStr = timeStr[0];
				} else if(timeStr.length == 1 || timeStr[1] == 0) {
					timeStr = timeStr2 + ' (' + timeStr[0] + ')';
				} else {
					timeStr = timeStr2 + ' (' + timeStr[0] + ' ' + (timeStr[1] > 0 ? '+' : '') + timeStr[1] + _('min') + ')';
				}
            
				sortable.push([time, timeStr, timeStr2, value]);
			});
        
			sortable.sort(function(a, b) {
				return a[0] - b[0];
			});
        
			return sortable;
		}
    
		getTodaysSeconds(datetime) {
			const [hours, minutes] = getDuration(datetime, 0);
        
			return (hours * 60 + minutes) * 60;
		}
    
		renderTimelineData_number() {
			let lastValue = this.lastDaysValue();
			var html = '';
			var html_pins = '';

			html += '<g class="timelinedata" >';
			html += '  <g transform="translate(20, 70)" >';
			html += '    <path fill="none" stroke="red" d="';
        
			var xPos = 0;
			var yPosLast = parseInt(this.getVerticalPosition(lastValue));
        
			html += ' M' + xPos + ',' + yPosLast;
        
			Object.entries(this.getOrderedScedule(this.day)).forEach(([index, value]) => { 
				let isAstro = !(value[1].indexOf(':') > 0 && value[1].length == 5);
				let xPos = this.getHorizontalPosition(value[0]);
				let yPos = this.getVerticalPosition(value[3]);
            
				html += ' L' + xPos + ',' + yPosLast;
				html += ' L' + xPos + ',' + yPos;
            
				yPosLast = yPos;
				let timeStr =  value[1].split('|');
            
				html_pins += '    <g transform="translate(' + xPos + ', 0)" class="' + (isAstro ? 'astro ' : '') + ' tooltipped" data-position="top" data-tooltip="' + value[1] + '">';
            
				if (isAstro) {
					html_pins += '      <use xlink:href="#astropointer" /> ';
				} else { 
					html_pins += '      <use xlink:href="#pointer" /> ';
				}
                                                                                  
				html_pins += '      <text x="20" y="30" font-size="20" text-anchor="middle" fill="#ffffff">' + value[3] + _(this.config.dataSign) + '</text>';
				html_pins += '    </g>';
			});
        
			html += ' L' + this.viewconfig.valueBoxWidth + ',' + yPosLast;
			html += '  " />';
			html += '  </g>';
			html += html_pins;
        
			if(this.object.overwrittenFrom && this.day == this.getParent().getTodaysSceduleDay()) {
				let from = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenFrom));
				let till = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenTill));
				html += '<g transform="translate(0, 60)" class="overwritten" >';
				html += '<rect x="' + from + '" y="0" width="' + (till - from) + '" height="60" fill="#ff0000" class="overwritten" />';
				html += '</g>';
			}
        
			html += '</g>';

			return html;
		}
    
		renderTimelineData_boolean() {
			let lastValue = this.lastDaysValue();
        
			var html = '';
			var html_pins = '';

			html += '<g class="timelinedata" >';
			html += '  <g transform="translate(20, 75)" >';
        
			var xPosLast = 0;
        
			Object.entries(this.getOrderedScedule(this.day)).forEach(([index, value]) => {
				let isAstro = !(value[1].indexOf(':') > 0 && value[1].length == 5);
				let xPos = this.getHorizontalPosition(value[0]);
            
				html += '<rect x="' + xPosLast + '" y="0" width="' + (xPos - xPosLast) + '" height="30" fill="' + (lastValue ? 'yellow': 'grey') + '" class="' + (lastValue ? 'on': 'off') + '" />';
            
				lastValue = value[3];
            
				xPosLast = xPos;

				html_pins += '    <g transform="translate(' + xPos + ', 0)" class="' + (isAstro ? 'astro ' : '') + ' tooltipped" data-position="top" data-tooltip="' + value[1] + '">';
            
				if (isAstro) {
					html_pins += '      <use xlink:href="#astropointer" /> ';
				} else { 
					html_pins += '      <use xlink:href="#pointer" /> ';
				}
                                                                                  
				html_pins += '      <text x="20" y="30" font-size="20" text-anchor="middle" fill="#ffffff">' + (value[3] ? _(this.config.dataMax) : _(this.config.dataMin)) + '</text>';
				html_pins += '    </g>';
			});
        
			html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="30" fill="' + (lastValue ? 'yellow': 'grey') + '" class="' + (lastValue ? 'on': 'off') + '" />';
        
			/*
        html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="60" fill="#ff0000" class="' + (value[3] ? "on": "off") + '" >';
        */
        
			html += '  </g>';
			html += html_pins;
        
			if(this.object.overwrittenFrom && this.day == this.getParent().getTodaysSceduleDay()) {
				let from = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenFrom));
				let till = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenTill));
				html += '<g transform="translate(0, 60)" class="overwritten" >';
				html += '  <rect x="' + from + '" y="0" width="' + (till - from) + '" height="60" fill="#ff0000" class="overwritten" />';
				html += '</g>';
			}
        
			html += '</g>';

			return html;
		}

		renderTimelineData_Heating() {
			let lastValue = this.lastDaysValue();
        
			var html = '';
			var html_pins = '';

			html += '<g class="timelinedata" >';
			html += '  <g transform="translate(20, 75)" >';
        
			var xPosLast = 0;
        
			Object.entries(this.getOrderedScedule(this.day)).forEach(([index, value]) => {
				let isAstro = !(value[1].indexOf(':') > 0 && value[1].length == 5);
				let xPos = this.getHorizontalPosition(value[0]);
            
				html += '<rect x="' + xPosLast + '" y="0" width="' + (xPos - xPosLast) + '" height="30" fill="' + (lastValue ? 'yellow': 'grey') + '" class="' + (lastValue ? 'on': 'off') + '" />';
            
				lastValue = value[3];
            
				xPosLast = xPos;

				html_pins += '    <g transform="translate(' + xPos + ', 0)" class="' + (isAstro ? 'astro ' : '') + ' tooltipped" data-position="top" data-tooltip="' + value[1] + '">';
            
				if (isAstro) {
					html_pins += '      <use xlink:href="#astropointer" /> ';
				} else { 
					html_pins += '      <use xlink:href="#pointer" /> ';
				}
                                                                                  
				html_pins += '      <text x="20" y="30" font-size="20" text-anchor="middle" fill="#ffffff">' + (value[3] ? this.config.dataMax : this.config.dataMin) + '</text>';
				html_pins += '    </g>';
			});
        
			html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="30" fill="' + (lastValue ? 'yellow': 'grey') + '" class="' + (lastValue ? 'on': 'off') + '" />';
        
			/*
        html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="60" fill="#ff0000" class="' + (value[3] ? "on": "off") + '" >';
        */
        
			html += '  </g>';
			html += html_pins;
        
			if(this.object.overwrittenFrom && this.day == this.getParent().getTodaysSceduleDay()) {
				let from = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenFrom));
				let till = this.getHorizontalPosition(this.getTodaysSeconds(this.object.overwrittenTill));
				html += '<g transform="translate(0, 60)" class="overwritten" >';
				html += '  <rect x="' + from + '" y="0" width="' + (till - from) + '" height="60" fill="#ff0000" class="overwritten" />';
				html += '</g>';
			}
        
			html += '</g>';

			return html;
		}
        
		buildHTML() {
			var html = '';

			if (!this.singleView && (this.day === 'guest' || this.day === 'off')) {
				html += '<div class="row"><div class="divider"></div></div>';
			}

			html += '<div class="row timeline_row valign-wrapper ' + this.day + '">';

			html += '<div class="col ' + (this.editable ? 's11' : 's12') + '">';
			html += '<div class="sceduleday' + (this.object.currentSceduleDay === this.day ? ' active_day' : '') + '">';
            html +=   this.getParent().getTimelineName(this.day);
			html += '</div>';
			html += '<svg class="timeline" viewBox="-15 0 780 ' + (this.viewconfig.valueBoxHeight + 90) + '">';
			html += '<defs>';
			html += '  <g id="pointer" transform="translate(-5, 0) scale(1.8)">';
			html += '    <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FF6E6E" />';
			html += '  </g>';
			html += '  <g id="astropointer" transform="translate(-5, 0) scale(1.8)">';
			html += '    <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#a0a0a0" />';
			html += '  </g>';
			html += '</defs>';
			html += '  <rect x="20" y="60" width="720" height="60" fill="#f8f8f8"/>';
			html += '  <g transform="translate(20, 140)" >';

			for (var h = this.viewconfig.dayHourFrom; h <= this.viewconfig.dayHourTill; h += this.viewconfig.dayHourStep) {
				html += '    <text x="' + (this.stepWidth * h) + '" y="0" font-size="18" text-anchor="middle" fill="#808080">' + h.toString().padStart(2, '0') + ':00</text>';
			}

			html += '  </g>';
			html += '  <g transform="translate(20, 70)" >';
			html += '    <path fill="none" stroke="#d8d8d8" stroke-width= "4" d="';

			for (var h = this.viewconfig.dayHourFrom; h <= this.viewconfig.dayHourTill; h += this.viewconfig.dayHourStep) {
				html += '      M ' + (this.stepWidth * h) + ',0 L ' + (this.stepWidth * h) + ',40';
			}

			html += '      " />';
			html += '</g>';
        
			if (this.object.type == 'number') {
				html += this.renderTimelineData_number();
			} else if (this.object.type == 'boolean') {
				html += this.renderTimelineData_boolean();
			}

			if(this.day === this.getParent().getTodaysSceduleDay()) {
				let now = this.getHorizontalPosition(this.getTodaysSeconds(new Date()));
				html += '<g transform="translate(0, 60)" class="overwritten" >';
				html += '  <rect x="' + now + '" y="0" width="2" height="60" fill="#000000" class="now" />';
				html += '</g>';
			}
        
			html += '</svg>';
			html += '</div>';
        
			if(this.editable) {
				html += '<div class="col s1">';
				html += '<a class="menu btn-floating btn-small waves-effect waves-light right"><i class="small material-icons">menu</i></a>';
				html += '</div>';
			}
			html += '</div>';

			return html;
		}
    
		remove() {
			this.$html.remove();
		}

		postRenderAction() {
			let view = this; 
        
			$('.menu', this.$html).on('click', function(e) {
				if(view.editable) {
					let modal = view.$html.parents('.modal');
                
					if(modal && modal.length) {
						view.getParent().route('sceduleconfiguration', true, view.day, 'collabsible:1', true);
					} else {
						view.getParent().route('collabsible', true, view.day, 'modal', true);
						view.getParent().route('sceduleconfiguration', true, view.day, 'collabsible:0', true);
					}

				}
			});

			$('g.tooltipped', this.$html).each(function(g, value) {
				value.offsetWidth = 30;
				value.offsetHeight = 30;
			})

			
        
			$('.tooltipped').tooltip();
		}
                                           
		updateView() {
			if (!this.$html || !this.day) {
				return;
			}
        
        	if (this.todayView) {
        		this.day = this.getParent().getTodaysSceduleDay(new Date());
        	}

			this.$html.html(this.buildHTML(this.day));
			this.postRenderAction();
		}
    
		render($container, day, editable) {
			this.day = day;
			this.editable = editable;
        
			if (!this.$html || !this.$html.length) {
				this.$html = $('<div></div>');
				this.$html.append(this.buildHTML());
				$container.append(this.$html);
			} else {
				this.$html.html(this.buildHTML());
			}
        
			$container.append(this.$html);
			this.postRenderAction();

			return this.$html;
		}
	}

    
	class yellowframe_Viewclass_Sceduleconfiguration {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.entryCnt = 0;
			this.$html;
			this.scedule = {};
			this.astrotimedata = {};
			this.day = '';
		}
    
		getParent() {
			return this.parent;
		}
    
		updateData(data) {
			this.scedule = data.scedule;
			this.object = data.object;
			this.config = data.config;
			this.astrotimedata = data.astrotimedata;
		}
    
		getFormData() {
			let view = this;
			let config = {};
        
			$('form > .row', this.$html).each(function( index ) {
				let value = 0;
				let time = $('*[name=time]', this).val();
            
				if (view.object.type == 'number') {
					value = $('*[name=value]', this).val();
				} else if (view.object.type == 'boolean') {
					value = $('*[name=value]', this).prop('checked');
				}
            
				if($(this).hasClass('astrotime')) {
					let shift = $('*[name=shift]', this).val();
                
					if (time && value || time && view.object.type == 'boolean') {
						config[time + '|' + shift] = value;
					}
				} else {
					if (time && value || time && view.object.type == 'boolean') {
						config[time] = value;
					}
				}
			});
        
			return config;
		}
    
		buildFormTimeEntry(time, value) {
			let html = '';
			html += '  <div class="row time valign-wrapper">';
			html += '    <div id="' + this.entryCnt + '" class="col input-field s7">';
			html += '       <input id="time' + this.entryCnt + '" name="time" type="text" class="form-control bs-timepicker validate" value="' + time + '">';
			html += '       <label for="time' + this.entryCnt + '">' + _('time') + '</label>';
			html += '    </div>';
        
			if (this.object.type == 'number') {
				html += '    <div class="col input-field s4">';
				html += '      <input id="value' + this.entryCnt + '" type="number" min="' + _(this.config.dataMin) + '" max="' + _(this.config.dataMax) + '" name="value" class="validate" value = "' + value + '">';
				html += '      <label for="value' + this.entryCnt + '">' + _('value') + ' ' + _(this.config.dataSign) + '</label>';
				html += '    </div>';
			} else if(this.object.type == 'boolean') {
				html += '    <div class="col input-field s4 switch">';
				html += '      <label>';
				html += '        ' + _(this.config.dataMin);
				html += '        <input id="value' + this.entryCnt + '" type="checkbox" name="value" class="validate" ' + (value ? 'checked' : '') + '>';
				html += '        <span class="lever"></span>';
				html += '        ' + _(this.config.dataMax);
				html += '      </label>';
				html += '    </div>';
			}
        
			html += '    <div class="col s1">';
			html += '      <a class="delete btn-floating btn-small waves-effect waves-light red right"><i class="small material-icons">delete</i></a>';
			html += '    </div>';
			html += '  </div>';
        
			this.entryCnt++;
        
			return html;
		}    
    
		buildFormAstrotimeEntry(timeValue, value) {
			timeValue = timeValue.split('|');
        
			let html = '';
			html += '  <div id="' + this.entryCnt + '" class="row astrotime valign-wrapper">';
			html += '    <div class="col input-field s5">';
			html += '      <select name="time">';
			html += '         <option value="" disabled></option>';
        
			Object.entries(this.getParent().astrotimes).forEach(([name, time]) => {
				html += '         <option value="' + name + '"' + ( name == timeValue[0] ? ' selected' : '')+ '>' + _(name) + ' ('+ time.toLocaleTimeString('de-de', {hour: '2-digit', minute: '2-digit'}) +')</option>';
			});
        
			html += '       </select>';
			html += '       <label for="time' + this.entryCnt + '">' + _('astrotime') + '</label>';
			html += '    </div>';
			html += '    <div class="col input-field s2">';
			html += '      <input id="shift' + this.entryCnt + '" type="number" min="-600" max="600" name="shift" class="validate" value = "' + (timeValue[1] ? timeValue[1] : '0') + '">';
			html += '      <label for="shift' + this.entryCnt + '">' + _('shift_min') + '</label>';
			html += '    </div>';
        
			if(this.object.type == 'number') {
				html += '    <div class="col input-field s4">';
				html += '      <input id="value' + this.entryCnt + '" type="number" min="' + this.config.dataMin + '" max="' + this.config.dataMax + '" name="value" class="validate" value = "' + value + '">';
				html += '      <label for="value' + this.entryCnt + '">' + _('value') + ' ' + _(this.config.dataSign) + '</label>';
				html += '    </div>';
			} else if(this.object.type == 'boolean') {
				html += '    <div class="col input-field s4 switch">';
				html += '      <label>';
				html += '        ' + _(this.config.dataMin);
				html += '        <input id="value' + this.entryCnt + '" type="checkbox" name="value" class="validate" ' + (value ? 'checked' : '') + '>';
				html += '        <span class="lever"></span>';
				html += '        ' + _(this.config.dataMax);
				html += '      </label>';
				html += '    </div>';
			}
    
			html += '    <div class="col s1">';
			html += '      <a class="delete btn-floating btn-small waves-effect waves-light red right"><i class="small material-icons">delete</i></a>';
			html += '    </div>';
			html += '  </div>';
        
			this.entryCnt++;
        
			return html;
		}
    
		buildHTML() {
			let html = '';
			let showPaste = localStorage.getItem('scedule');
        
			html += '<div class="row">';
			//html += '  <div class="title">' + this.day + '</div>'
			html += '  <form action="#">';

            if (this.scedule[this.day]) {
				var sortable = [];

				Object.entries(this.scedule[this.day]).forEach(([timeStr, value]) => {
					let otimeStr = timeStr;

					if(timeStr.indexOf(':') <= 0) {
						timeStr = timeStr.split('|');
						timeStr = new Date(this.getParent().astrotimes[timeStr[0]].getTime() + (timeStr[1] ?  timeStr[1] * 60 * 1000 : 0)).toLocaleTimeString('de-de', {hour: '2-digit', minute: '2-digit'});
					}

					let time = new Date('01 Jan 1970 ' + timeStr + ':00 GMT').getTime() / 1000;
					sortable.push([time, otimeStr, value]);
				});

				sortable.sort(function(a, b) {
					return a[0] - b[0];
				});

                Object.entries(sortable).forEach(([i, value]) => {
                    let isAstro = !(value[1].indexOf(':') > 0 && value[1].length == 5);
                
                    if(isAstro) {
                        html += this.buildFormAstrotimeEntry(value[1], value[2]);
                    } else {
                        html += this.buildFormTimeEntry(value[1], value[2]);
                    }
                });
            }
        
			html += '  </form>';


			html += '  <div class="row">';
			html += '    <div class="col input-field s12">';
			html += '      <a class="dropdown-trigger btn" href="#" data-target="dropdown1"><i class="material-icons">menu</i></a>';
			html += '      <ul id="dropdown1" class="dropdown-content">';
			html += '        <li><a class="addtime"><i class="material-icons">playlist_add</i>' + _('time') + '</a></li>';
			html += '        <li><a class="addastrotime"><i class="material-icons">playlist_add</i>' + _('astrotime') + '</a></li>';
			html += '        <li class="divider" tabindex="-1"></li>';
			html += '        <li><a class="copy"><i class="material-icons">content_copy</i>' + _('copy') + '</a></li>';
        
			if(showPaste) {
				html += '        <li><a class="paste disable"><i class="material-icons">content_paste</i>' + _('paste') + '</a></li>';
			}
        
			html += '      </ul>';
			html += '    </div>';
			html += '  </div>';

			html += '</div>';

			return html;
		}
    
		pushUpdate() {
			let config = {};
			config['scedule'] = {};
			config['scedule'][this.day] = this.getFormData();
			this.getParent().getContainer().trigger('change', config);
		}
    
		postRenderAction() {
			let view = this;
        
            var elems = $('.bs-timepicker', this.$html);
            M.Timepicker.init(elems, {twelveHour: this.viewconfig.showMedian});
        
            elems = $('.dropdown-trigger', this.$html);
			M.Dropdown.init(elems, {});
                
            var elems = $('select', this.$html);
            M.FormSelect.init(elems, {});

			$('.delete', this.$html).on('click', function() {   
				$(this).parent().parent().remove();
				view.pushUpdate();
			});
        
			$('input, select, textarea', this.$html).on('change', function() {
				view.pushUpdate();
			});
        
			M.updateTextFields();
		}
    
		updateView() {
			if(!this.$html || !this.day || !this.scedule) {
				return;
			}
        
			this.$html.html(this.buildHTML(this.day));
			this.postRenderAction();
		}
    
		render($container, day) {
			let view = this;
			this.day = day;
			this.entryCnt = 0;
        
			if (!this.$html || !this.$html.length) {
				let html = '';
				html += '<div></div>';
				this.$html = $(html);
				this.$html.append(this.buildHTML(this.day));
			} else {
				$('div', this.$html).replaceWith(this.buildHTML(this.day));
			}
        
			$container.append(this.$html);
			view.postRenderAction();

			$('.addtime', this.$html).on('click', function() {
				$('form', this.$html).append(view.buildFormTimeEntry('', ''));
				view.postRenderAction();
			});
        
			$('.addastrotime', this.$html).on('click', function() {
				$('form', this.$html).append(view.buildFormAstrotimeEntry('', ''));
				view.postRenderAction();
			});
        
			$('.copy', this.$html).on('click', function() {
				let config = view.getFormData();
				localStorage.setItem('scedule', JSON.stringify(config));
			});
        
			$('.paste', this.$html).on('click', function() {
				view.scedule[view.day] = JSON.parse(localStorage.getItem('scedule'));
				view.updateView();
				view.pushUpdate();
			});

			return this.$html;
		}
	}


	class yellowframe_Viewclass_configuration {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.$html;
			this.config;
		}

		getParent() {
			return this.parent;
		}
    
		updateData(data) {
			this.config = data.config;
			this.object = data.object;
		}
    
		getFormData() {
			let view = this;
        
			return {config: {
				active: $('input[name=active]', view.$html).prop('checked'),
				template: $('select[name=template]', view.$html).val(),
				overrideBehavior: $('select[name=overrideBehavior]', view.$html).val(),
				guestBehavior: $('select[name=guestBehavior]', view.$html).val(),
				considerDayAtHome: $('input[name=considerDayAtHome]', view.$html).prop('checked'),
				considerOffDays: $('input[name=considerOffDays]', view.$html).prop('checked'),
				onlyIfGuest: $('input[name=onlyIfGuest]', view.$html).prop('checked'),
				considerOwnRule: $('input[name=considerOwnRule]', view.$html).prop('checked'),
				ownRule: $('textarea[name=ownRule]', view.$html).val(),
				dataRole: $('#dataRole', view.$html).val(),
				dataSign: $('#dataSign', view.$html).val(),
				dataMin: $('#dataMin', view.$html).val(),
				dataMax: $('#dataMax', view.$html).val()
			}};
		}
    
		updateView() {
			if(!this.$html) {
				return;
			}
        
			this.$html.html(this.buildHTML(this.day));
			this.postRenderAction();
		}
    
		buildHTML() {
			let html = '';
			html += '<div class="row nomargin">';
			html += '<form action="#">';
			html += '  <div class="row">';
			html += '    <div class="col s12">';
			html += '      <div class="switch">';
			html += '        <label>';
			html += '          ' + _('active') + ': ' + _('off');
			html += '          <input type="checkbox" name="active" />';
			html += '          <span class="lever"></span>';
			html += '          ' + _('on');
			html += '        </label>';
			html += '      </div>';
			html += '    </div>';
			html += '  </div>';
			html += '  <div class="row">';
			html += '    <div class="input-field col s12 m6">';
			html += '      <select name="template">';
			html += '        <option value="null" disabled selected>' + _('choose_your_option') + '</option>';
			html += '        <option value="full">' + _('full_week') + '</option>';
			html += '        <option value="min">' + _('workdays_Weekend') + '</option>';
			html += '        <option value="single">' + _('single_day') + '</option>';
			html += '      </select>';
			html += '      <label>' + _('Template') + '</label>';
			html += '    </div>';
			html += '    <div class="input-field col s12 m6">';
			html += '      <select name="overrideBehavior">';
            html += '        <option value="null" disabled selected>' + _('choose_your_option') + '</option>';
			html += '        <option value="force">' + _('force_scedule') + '</option>';
			html += '        <option value="1 Minute">1 ' + _('minute') + '</option>';
            html += '        <option value="2 Minutes">2 ' + _('minutes') + '</option>';
            html += '        <option value="5 Minutes">5 ' + _('minutes') + '</option>';
            html += '        <option value="10 Minutes">10 ' + _('minutes') + '</option>';
            html += '        <option value="30 Minutes">30 ' + _('minutes') + '</option>';
            html += '        <option value="1 Hour">1 ' + _('hour') + '</option>';
			html += '        <option value="2 Hours">2 ' + _('hours') + '</option>';
			html += '        <option value="4 Hours">4 ' + _('hours') + '</option>';
			html += '        <option value="next change">' + _('next_change') + '</option>';
			html += '      </select>';
			html += '      <label>' + _('overwrite_behavier') + '</label>';
			html += '    </div>';
			html += '    <div class="col s12">';
			html += '      <p>';
			html += '      <label>';
			html += '        <input type="checkbox" name="considerDayAtHome" class="filled-in" checked="checked" />';
			html += '        <span>' + _('consider_day_at_home_uses_sunday_scedule') + '</span>';
			html += '      </label>';
			html += '      </p>';
			html += '      <p>';
			html += '      <label>';
			html += '        <input type="checkbox" name="considerOffDays" class="filled-in" checked="checked" />';
			html += '        <span>' + _('consider_off_days') + '</span>';
			html += '      </label>';
			html += '      </p>';
			//html += '      <p>';
			//html += '      <label>';
			//html += '        <input type="checkbox" name="considerOwnRule" class="filled-in" checked="checked" />';
			//html += '        <span>' + _('consider_own_rule') + '</span>';
			//html += '      </label>';
			//html += '      </p>';
			html += '    </div>';
			//html += '    <div class="col s12">';
			//html += '      <textarea id="textarea1" class="materialize-textarea" name="ownRule"></textarea>';
			//html += '      <label for="textarea1">' + _('own_rule') + '</label>';
			//html += '    </div>';
			html += '  </div>';
			html += '  <div class="row">';
			html += '    <div class="input-field col s12 m12">';
			html += '      <select name="guestBehavior">';
            html += '        <option value="null" selected>' + _('do_not_consider_guest') + '</option>';
			html += '        <option value="inactive">' + _('inactive_if_not_guest') + '</option>';
			html += '        <option value="off">' + _('off_day_if_not_guest') + '</option>';
            html += '        <option value="guest">' + _('own_guest_scedule') + '</option>';
			html += '      </select>';
			html += '      <label>' + _('guest_behavier') + '</label>';
			html += '    </div>';
			html += '  </div>';
			html += '  <div class="row">';
			html += '    <div class="divider"></div>';
			html += '  </div>';
			html += '  <div class="row">';
            html += '    <div class="input-field col s3">';
            html += '       <input id="dataType" type="text" disabled value="' + _(this.object.type) + '">';
            html += '       <label for="dataType">' + _('data_type') + '</label>';
            html += '    </div>';
            html += '    <div class="input-field col s1">';
            html += '     ';
            html += '    </div>';
            
            if(this.object.type === 'number') {
                html += '    <div class="input-field col s8">';
                html += '      <select name="dataRole" id="dataRole">';
                html += '        <option value="null" disabled selected> - </option>';
                html += '        <option value="role_n0" disabled>' + _('custom') + '</option>';
                html += '        <option value="role_n1" data-min="-127" data-max="127" data-sign="">' + _('value') + '</option>';
                html += '        <option value="role_n2" data-min="0" data-max="100" data-sign="%">' + _('percent') + '(%)</option>';
                html += '        <option value="role_n3" data-min="5" data-max="30" data-sign="°C">' + _('heat') + '(°C)</option>';
                html += '      </select>';
                html += '      <label>' + _('Data Prefill') + '</label>';
                html += '    </div>'; 
                html += '    <div class="input-field col s3">';
                html += '       <input id="dataSign" type="text">';
                html += '       <label for="dataSign">' + _('data_sign') + '</label>';
                html += '    </div>';
                html += '    <div class="input-field col s1">';
                html += '      - ';
                html += '    </div>';
                html += '    <div class="input-field col s4">';
                html += '       <input id="dataMin" type="text">';
                html += '       <label for="dataMin">' + _('min_value') + '</label>';
                html += '    </div>';
                html += '    <div class="input-field col s4">';
                html += '       <input id="dataMax" type="text" >';
                html += '       <label for="dataMax">' + _('max_value') + '</label>';
                html += '    </div>';
            } else if(this.object.type === 'boolean') {
                html += '    <div class="input-field col s8 m6">';
                html += '      <select name="dataRole" id="dataRole">';
                html += '        <option value="null" disabled selected> - </option>';
                html += '        <option value="role_b0" disabled>custom</option>';
                html += '        <option value="role_b1" data-min="off" data-max="on">' + _('on') + ' / ' + _('off') + '</option>';
                html += '        <option value="role_b2" data-min="closed" data-max="open">' + _('open') + ' / ' + _('closed') + '</option>';
                html += '        <option value="role_b3" data-min="stopped" data-max="started">' + _('start') + ' / ' + _('stop') + '</option>';
                html += '        <option value="role_b4" data-min="false" data-max="true">' + _('true') + ' / ' + _('false') + '</option>';
                html += '        <option value="role_b5" data-min="0" data-max="1">1 / 0</option>';
                html += '        <option value="role_b6" data-min="O" data-max="I">I / O</option>';
                html += '      </select>';
                html += '      <label>Data Prefill</label>';
                html += '    </div>';
                html += '    <div class="input-field col s4">';
                html += '       <input id="dataMin" type="text">';
                html += '       <label for="dataMin">' + _('value_name_false') + '</label>';
                html += '    </div>';
                html += '    <div class="input-field col s1 center-align">';
                html += '      - ';
                html += '    </div>';
                html += '    <div class="input-field col s4">';
                html += '       <input id="dataMax" type="text" >';
                html += '       <label for="dataMax">' + _('value_name_true') + '</label>';
                html += '    </div>';
            }
            
			html += '  </div>';
			html += '</form>';
			html += '</div>';
        
			return html;
		}
    
		pushUpdate() {
			let config = this.getFormData();
            console.log(config);
			this.getParent().getContainer().trigger('change', config);
		}
    
		postRenderAction() {
			try {
				let view = this;
	        
				if(this.config) {
					$('input[name=active]', this.$html).prop('checked', this.config.active);       
					$('select[name=template]', this.$html).val(this.config.template);
					$('select[name=overrideBehavior]', this.$html).val(this.config.overrideBehavior);
					$('select[name=guestBehavior]', this.$html).val(this.config.guestBehavior);
					$('input[name=considerDayAtHome]', this.$html).prop('checked', this.config.considerDayAtHome);
					$('input[name=considerOffDays]', this.$html).prop('checked', this.config.considerOffDays);
					$('input[name=onlyIfGuest]', this.$html).prop('checked', this.config.onlyIfGuest);
					$('input[name=considerOwnRule]', this.$html).prop('checked', this.config.considerOwnRule);
					$('textarea[name=ownRule]', this.$html).val(this.config.ownRule);
					$('#dataRole', this.$html).val(_(this.config.dataRole));
					$('#dataSign', this.$html).val(_(this.config.dataSign));
					$('#dataMin', this.$html).val(_(this.config.dataMin));
					$('#dataMax', this.$html).val(_(this.config.dataMax));
				}
	        
	            $('#dataRole', this.$html)
	                .on('change', function(e) {
	                console.log(e.target.selectedOptions);
	                $("#dataSign", this.$html).val(_($(e.target.selectedOptions).data("sign")));
	                $("#dataMin", this.$html).val(_($(e.target.selectedOptions).data("min")));
	                $("#dataMax", this.$html).val(_($(e.target.selectedOptions).data("max")));
	                M.updateTextFields();
	            })
	            
				try {
                
                    var elems = $('select', this.$html);
                    M.FormSelect.init(elems, {});
                    
					M.textareaAutoResize($('textarea', this.$html));
					M.updateTextFields();
				} catch(e) {
					console.log('yellowframe_Viewclass_configuration -> postRenderAction: ' + e);
				}
	        
				this.$html.find('input, select, textarea').change(function() {
					view.pushUpdate();
				});
			} catch(e) {
				console.error('yellowframe_Viewclass_configuration->postRenderAction()' + e);
			}
		}
    
		render($container) {
			var view = this;

			if (!this.$html || !this.$html.length) {
				this.$html = $('<div></div>');
				this.$html.append(this.buildHTML());
			} else {
				$('div', this.$html).replaceWith(this.buildHTML());
			}
        
			$container.append(this.$html);
			this.postRenderAction();
        
			return this.$html;
		}
	}

    
	class yellowframe_Viewclass_Timeline_Set {
		constructor(parent, viewconfig) {
			let view = this;
			this.$container;
			this.editable;
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.$html;
			this.timelines = {};
			this.data;
			this.scedule;

            this.sceduleDayDef = {
                'full': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
                'min': ['mo', 'su'],
                'single': ['mo']
            };

            this.specialScedule = {
            	'guest': function(view) {
            		return view.config.guestBehavior === 'guest'
            	},
            	'off': function(view) {
     				return view.config.considerOffDays || view.config.guestBehavior === 'off'
            	}
            }
		}
    
		parent() {
			return this.viewconfig;
		}
    
		updateData(data) {
			this.data = data;
            this.config = data.config;
			this.scedule = data.scedule;
        
			Object.entries(this.timelines).forEach(([day, timelineView]) => {
				timelineView.updateData(data);
			});
		}
    
		updateView() {
			this.buildElements();

			//Object.entries(this.timelines).forEach(([day, timelineView]) => {
			//	timelineView.updateView();
			//});
		}
    
		postRenderAction() {
        
		}
    
		renderTimeline(day) {
			let view = this;
        
			if(!view.timelines[day]) {
				view.timelines[day] = new yellowframe_Viewclass_Timeline(view.parent, view.viewconfig);
				view.timelines[day].updateData(view.data);
				view.timelines[day].singleView = false;
			}

			view.timelines[day].updateData(view.data);
			view.timelines[day].render(view.$container, day, view.editable);
		}

		buildElements() {
			if (!this.$container) return;

			let days = Object.keys(this.timelines);
			let view = this;

			try {
				this.sceduleDayDef[this.config.template].forEach(day => {
					days.splice(days.indexOf(day), 1);
					view.renderTimeline(day);
				});

				Object.entries(this.specialScedule).forEach(([day, test]) => {
					if (test(view)) {
						days.splice(days.indexOf(day), 1);
						view.renderTimeline(day);
					}
				});

				days.forEach(function(day) {
					view.timelines[day].remove();
					delete view.timelines[day];
				}); 
			} catch(e) {
				console.error("ERROR: buildElements: " + e)
			} 
		}

		render($container, editable) {
			this.$container = $container;
			this.editable = editable;

			this.buildElements();
		}
	}

    
	class yellowframe_Viewclass_Modal {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.$html;
		}
    
		parent() {
			return this.viewconfig;
		}
    
		postRenderAction() {
			var elem = document.querySelectorAll('.modal');
			var instance = M.Modal.init(elem, {
				dismissible: true
			});

			instance[0].open();
		}
    
		buildHTML() {
			let html = '';
			html += '<div class="modal">';
			html += '  <div class="modal-header row">';
			html += '  </div>';
			html += '  <div class="modal-content">';
			html += '  </div>';
			html += '</div>';
      
			return html;
		}
    
		render($container) {
			var view = this;

			this.$html = $('#modal');
        
			if (!this.$html || !this.$html.length) {
				this.$html = $('<div id="modal" class="materialize"></div>');
				this.$html.append(this.buildHTML());
				$container.append(this.$html);
			}
        
			this.postRenderAction();
        
			return this.$html;
		}
	}
    

	class yellowframe_Viewclass_Collabsible {
		constructor(parent, viewconfig) {
			this.parent = parent;
			this.viewconfig = viewconfig;
			this.$html;
			this.timelines = {};
			this.data;
			this.scedule;
			this.collapsible;
			this.editable;
		}
    
		parent() {
			return this.viewconfig;
		}
    
		updateData(data) {
			this.data = data;
			this.scedule = data.scedule;
			this.adapter = data.adapter;
			this.object = data.object;
			// DO Stuff
		}
    
		updateView() {
			if (!this.$html) return;

			this.$html.html(this.buildHTML(this.day));
			this.postRenderAction();
		}
    
		getInstance() {
			try {
				return M.Collapsible.getInstance($('.collapsible', this.$html)[0]);
			} catch(e) {
				return null;
			}
		}
    
		postRenderAction() {
			let view = this;
        
			var instances = M.Collapsible.init(document.querySelectorAll('.collapsible'), {
				onOpenStart: function(e) {
					if($(e).attr('data-template') == 'timeline' && view.editable) {
						view.parent.route('configuration', true, null, 'collabsible:1', false);
					}
				}
			});

			if(typeof instances === 'object') {
				this.collapsible = instances[0];
			} else {
				this.collapsible = instances;
			}
		}
    
		appendEntry(colId, title, templateName) {
			let $col = $('.col' + colId, this.$html);
        
			if(!$col.length) {
				$col = $(this.buildHTMLElement(colId, title));
				$('.collapsible', this.$html).append($col);
			} else {
				$('.collapsible-header', $col).html(title);
			}

            $col.attr('data-template', templateName);
        
			return $('.collapsible-body', $col);
		}
    
		buildHTMLElement(colId, title) {
			let html = '';
			html += '<li class="col' + colId +'">';
			html += '  <div class="collapsible-header">' + title + '</div>';
			html += '  <div class="collapsible-body"></div>';
			html += '</li>';
        
			return html;
		}
    
		buildHTML() {
			let html = '';
			html += '<ul class="collapsible">';
			html += '<li class="col0 active">';
			html += '  <div class="collapsible-header"><i class="material-icons">filter_drama</i></div>';
			html += '  <div class="collapsible-body"></div>';
			html += '</li>';
			html += '</ul>';
        
			return html;
		}
    
		render($container, editable) {
			this.editable = editable;
			var view = this;
        
			if (!this.$html || !this.$html.length) {
				this.$html = $('<div></div>');
				this.$html.append(this.buildHTML());
			} else {
				$('> div', this.$html).replaceWith(view.buildHTML());
			}
        
			$('li', this.$html).remove();
        
			$container.append(this.$html);
			this.postRenderAction();
        
			return this.$html;
		}
	}


	class yellowframe_router {
		constructor($container, viewconfig) {
			this.$container = $container;
			this.viewconfig = viewconfig;
      
			this.frameView = new yellowframe_Viewclass_frame(this, this.viewconfig);
			this.modalView = new yellowframe_Viewclass_Modal(this, this.viewconfig);
			this.collabsibleView = new yellowframe_Viewclass_Collabsible(this, this.viewconfig);
			this.timelineView = new yellowframe_Viewclass_Timeline(this, this.viewconfig);
			this.timelineSetView = new yellowframe_Viewclass_Timeline_Set(this, this.viewconfig);
			this.sceduleconfigurationView = new yellowframe_Viewclass_Sceduleconfiguration(this, this.viewconfig);
			this.configurationView = new yellowframe_Viewclass_configuration(this, this.viewconfig);
			this.scedule = {};
		}

		getContainer() {
			return this.$container;
		}
    
		update(data) {
			this.configurationView.updateData(data);
			this.sceduleconfigurationView.updateData(data);
			this.timelineSetView.updateData(data);
			this.timelineView.updateData(data);
			this.frameView.updateData(data);
      
			this.astrotimedata = data.astrotimedata;
			this.object = data.object;
			this.adapter = data.adapter;
			this.scedule = data.scedule;
			this.config = data.config;

            /* Good Idea, but ... 
            if (!this.astrotimedata?.latitude && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    this.astrotimedata = {};
                    this.astrotimedata.latitude = position.coords.latitude;
                    this.astrotimedata.longitude = position.coords.longitude;
                });
            } 
            */

            if (this.astrotimedata) {
			     this.astrotimes = SunCalc.getTimes(new Date(), this.astrotimedata.latitude, this.astrotimedata.longitude);
            }
		}
    
		updateViews() {
			this.configurationView.updateView();
			this.sceduleconfigurationView.updateView();
			this.timelineSetView.updateView();
			this.timelineView.updateView();
			this.frameView.updateView();
		}

        getTimelineName(day) {
        	if (day === 'off') {
        		return _('off');
        	} else if (day === 'guest') {
        		return _('guest');
        	}

            if(this.config.template === 'full') {
                switch(day) {
                    case 'mo': return _('mo'); break;
                    case 'tu': return _('tu'); break;
                    case 'we': return _('we'); break;
                    case 'th': return _('th'); break;
                    case 'fr': return _('fr'); break;
                    case 'sa': return _('sa'); break;
                    case 'su': return _('su'); break;
                }
            } else if (this.config.template === 'min') {
                switch(day) {
                    case 'mo': return _('workday'); break;
                    case 'su': return _('weekend'); break;
                }
            } else { // single
                switch(day) {
                    case 'mo': return _('everyday'); break;
                }
            }
            
            return "ERROR";
        }

		getTodaysSceduleDay(date) {
			if(!date) { date = new Date(); }
        
			let sceduleDayDef = {
                'full': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
                'min': ['mo', 'su'],
                'single': ['mo']
            };

			let days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
			let today = days[date.getDay()];
			let workdays = ['mo', 'tu', 'we', 'th', 'fr'];

			if (!this.object.isGuestActive && this.config.guestBehavior === 'inactive') {
				return 'inactive';
			} else if(this.object.isOffDay && this.config.considerOffDays || !this.object.isGuestActive && this.config.guestBehavior === 'off') {
				return 'off';
			} else if(this.object.isGuestActive && this.config.guestBehavior === 'guest') {
				return 'guest';
			} else if (this.config.template == 'single' && this.config.considerDayAtHome) {
				return 'su';
			} else {
				switch(this.config.template) {
				case 'full':
					return this.day;
					break;
				case 'min':
					if(workdays.includes(today)) {
						return 'mo';
					} else {
						return 'su';
					}
					break;
				case 'single':
					return 'mo';
					break;
				}
			}
		}
    
		buildModalHead() {
			var html = '';
			html    += '<div class="col s9">';
			html    += '  <span clasS="oname">';
			html    += '    ' + this.object.name;
			html    += '  </span>';
			html    += '  <span clasS="oid">';
			html    += '    (' + this.object.id + ')';
			html    += '  </span>';
			html    += '</div>';
			html    += '<div class="col s3 right-align">';
			html    += '  <span class="adapter">';
			html    += '    ' + _('adapter') + ': ';
			html    += '  </span>';
			html    += '  <span class="adapter_' + this.adapter.status + '" > </span>';
			html    += '</div>';

			return html;
		}

		route(template, editable, day, target, open) {
			if (typeof editable === 'undefined') {
				editable = true;
			}
      
			if (typeof open === 'undefined') {
				open = false;
			}
      
			if (typeof target === 'undefined') {
				target = this.$container;
			}
    
			let collabsibleOpen = -1;
      
			if(typeof target === 'string') {
				target = target.split(':');
        
				switch (target[0]) {
				case 'modal':
					this.modalView.render($('body'));
					$('>.modal>.modal-header', this.modalView.$html).html(this.buildModalHead());
					target = $('>.modal>.modal-content', this.modalView.$html);
					this.modalView.$html.attr('data-template', template);
					target.empty();
					break;
				case 'collabsible':
					collabsibleOpen = open ? target[1] : -1;
                    let title = '<i class="material-icons">filter_drama</i>' + _(template) + (day ? ' (' + _(this.getTimelineName(day)) + ')' : '');
					target = this.collabsibleView.appendEntry(target[1], title, template);
					target.empty();
					break;
				default:
					target = this.$container;
					break;
				}
			}
            
			if(typeof target === 'object') {
				switch (template) {
				case 'frame':
					this.frameView.render(target, editable);
					break;
				case 'collabsible':
					this.collabsibleView.render(target, editable);
					break;
				case 'timeline_single':
					this.timelineView.render(target, day, editable);
					break;
				case 'timeline_single_today':
					this.timelineView.render(target, this.getTodaysSceduleDay(new Date()), editable);
					this.timelineView.todayView = true;
					break;
				case 'timeline':
					this.timelineSetView.render(target, editable);
					break;
				case 'sceduleconfiguration':
					this.sceduleconfigurationView.render(target, day);
					break;
				case 'configuration':
					this.configurationView.render(target);
					break;
				default:
					// code block
					break;
				}
			}
      
			if(collabsibleOpen > -1) {
				this.collabsibleView.getInstance()?.open(collabsibleOpen);
			}
		}
	}

    
	// this code can be placed directly in yellowframe.html
	vis.binds['yellowframe'] = {
		version: '0.0.203',
		$div: null,
		showVersion: function () {
			if (vis.binds['yellowframe'].version) {
				console.log('Version yellowframe: ' + vis.binds['yellowframe'].version);
				vis.binds['yellowframe'].version = null;
			}
		},

		getSelectValues: function(widAttr, options) {
	        // Select
	       
	        var values = {
				'mo' : _('mo') + ' / ' + _('workday') + ' / ' + _('everyday'),
				'tu' : _('tu'),
				'we' : _('we'),
				'th' : _('th'),
				'fr' : _('fr'),
				'sa' : _('sa'),
				'su' : _('su') + ' / ' + _('workday') + ' / ' + _('off'),
				'optional_off' : _('optional Day off'),
				'optional_guest' : _('optional guest scedule'),
				'optional_day_at_home' : _('day_at_home')
			};

	        var line = {
	            input: '<select type="text" id="inspect_' + widAttr + '">'
	        };

            for (var name in values) {
                line.input += '<option value="' + name + '">' + values[name] + '</option>';
            }

	        line.input += '</select>';
	        return line;
		},

		buildFrameObject: function(widgetID, data, callback) {
            var viewconfig = {};
            viewconfig.widgetWidth = 1000;
            viewconfig.valueBoxWidth = 720;
            viewconfig.valueBoxHeight = 50;
            viewconfig.valueBoxPadding = 5;
            viewconfig.dayHourFrom = 0;
            viewconfig.dayHourTill = 24;
            viewconfig.dayHourStep = 4;
            viewconfig.showMedian = false;

            var adapterData = {
                adapter: {
                    status: 'offline' 
                }
            };

            var yellowframe = new yellowframe_router($('#' + widgetID), viewconfig);

            if (vis.editmode) {
            	$('#' + widgetID).addClass('editmode');
            }
    
            var shadowObjectBounded = false;

            var bindShadowObject = function(shadowstate) {
                if(shadowObjectBounded) return

                vis.conn.subscribe(shadowstate);
            
                vis.states.bind(shadowstate + '.val', function(e, newVal) {
                	try {
	                    //M.toast({html: 'recive update from ' + adapterData.object.id });
	                    let data = JSON.parse(newVal);
	                    adapterData.config = data.config;
	                    adapterData.scedule = data.scedule;
	                    adapterData.object = data.object;
	                    adapterData.object.sync = true;

	                    yellowframe.update(adapterData);
						yellowframe.timelineView.updateView();
	                    yellowframe.updateViews();
                	} catch(e) {
                		console.error("Error: OnShaddowObjectUpdate: " + e);
                	}
                });

                shadowObjectBounded = true;
            }

            var getObject = function() {
                vis.conn.sendTo('yellowframe.0', 'getObject', {id: data.oid}, function(a){

                    if (a.status == 'error') {
                        M.toast({html: 'An error occurred while loading object (' + data.oid + ') ' + a.message});
                    }

                    adapterData.config = a.data.config;
                    adapterData.scedule = a.data.scedule;
                    adapterData.object = a.data.object;
                    adapterData.astrotimedata = a.data.astrotimedata;
                    adapterData.shadowstate = a.data.shadowstate;
                    adapterData.adapter.status = 'active';
                    adapterData.timeDifferenz = new Date().getTime() - adapterData.adapterTime;
                
                    bindShadowObject(adapterData.shadowstate);
                            
                    yellowframe.update(adapterData);
					yellowframe.timelineView.updateView();
                    yellowframe.frameView.updateView();

	                callback(yellowframe);
                });
            }

            yellowframe.update(adapterData);
            vis.conn.subscribe('system.adapter.yellowframe.0.alive');

            vis.states.bind('system.adapter.yellowframe.0.alive.val', function(e, newVal) {
                if (newVal) {
                    getObject();
                } else {
                    adapterData.adapter.status = 'offline';
                    yellowframe.update(adapterData);
                    yellowframe.frameView.updateView();
                }
            });   
        
            getObject();
        
			$('#' + widgetID).on('change', function(e, newData) {
				if(typeof newData !== 'undefined') {
					if(newData.scedule) {
						Object.entries(newData.scedule).forEach(([day, scedule]) => {
							adapterData.scedule[day] = scedule;
						});
                    
						let request = {
							id: data.oid,
							scedule: newData.scedule
						};
                    
						vis.conn.sendTo('yellowframe.0', 'setScedule', request, function(a) {
							// OK
						});
                    
						yellowframe.timelineSetView.updateView();
						yellowframe.timelineView.updateView();
					}
                
					if(newData.config) {
						adapterData.config = newData.config;
                    
						let request = {
							id: data.oid,
							config: newData.config
						};
                    
						vis.conn.sendTo('yellowframe.0', 'setConfig', request, function(a) {
							// OK
						});
                    
						yellowframe.update(adapterData);
						yellowframe.timelineSetView.updateView();
						yellowframe.timelineView.updateView();
						yellowframe.frameView.updateView();
					}
				}
			});

			return yellowframe;
		},

		ObjectBind: function(oid, callback) {
			if (oid) {
				if(vis.states) {
					vis.states.bind(oid + '.val', callback);
				}
            
				//remember bound state that vis can release if didnt needed
				vis.binds['yellowframe'].$div.data('bound', [oid + '.val']);
				//remember onchange handler to release bound states
				vis.binds['yellowframe'].$div.data('bindHandler', callback);
			}
		},

		createTodaysTimelineWidget: function (widgetID, view, data, style) {
			var $div = $('#' + widgetID);

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['yellowframe'].createTodaysTimelineWidget(widgetID, view, data, style);
                }, 100);
            }

            vis.binds['yellowframe'].buildFrameObject(widgetID, data, function(yellowframe) {
            	yellowframe.route('timeline_single_today', data.attr('editable'));
            });
		},

		createSingleTimelineWidget: function (widgetID, view, data, style) {
			var $div = $('#' + widgetID);

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['yellowframe'].createSingleTimelineWidget(widgetID, view, data, style);
                }, 100);
            }

            vis.binds['yellowframe'].buildFrameObject(widgetID, data, function(yellowframe) {
            	yellowframe.route('timeline_single', data.attr('editable'), data.attr('day'));
            });
		},

		createTimelineSetWidget: function (widgetID, view, data, style) {
			var $div = $('#' + widgetID);

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['yellowframe'].createTimelineSetWidget(widgetID, view, data, style);
                }, 100);
            }

            vis.binds['yellowframe'].buildFrameObject(widgetID, data, function(yellowframe) {
            	yellowframe.route('timeline', data.attr('editable'));
            });
		},

		createFrameWidget: function (widgetID, view, data, style) {
			var $div = $('#' + widgetID);

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['yellowframe'].createFrameWidget(widgetID, view, data, style);
                }, 100);
            }

            vis.binds['yellowframe'].buildFrameObject(widgetID, data, function(yellowframe) {
            	yellowframe.route('frame', data.attr('editable'));
            });
		},

		createTimelineWidget: function (widgetID, view, data, style) {
			var $div = $('#' + widgetID);

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['yellowframe'].createFrameWidget(widgetID, view, data, style);
                }, 100);
            }

            vis.binds['yellowframe'].buildFrameObject(widgetID, data, function(yellowframe) {
            	yellowframe.route('frame', data.attr('editable'));
            });
		}
	};

	vis.binds['yellowframe'].showVersion();
});