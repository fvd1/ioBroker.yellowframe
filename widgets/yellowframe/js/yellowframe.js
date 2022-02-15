/*
    ioBroker.vis yellowframe Widget-Set

    version: "0.0.1"

    Copyright 2022 fvd1 frederik@von-dieken.de
*/
"use strict";


$(function() {
// add translations for edit mode
$.extend(
    true,
    systemDictionary,
    {
        // Add your translations here, e.g.:
        // "size": {
        //  "en": "Size",
        //  "de": "Größe",
        //  "ru": "Размер",
        //  "pt": "Tamanho",
        //  "nl": "Grootte",
        //  "fr": "Taille",
        //  "it": "Dimensione",
        //  "es": "Talla",
        //  "pl": "Rozmiar",
        //  "zh-cn": "尺寸"
        // }
    }
);

    
        

    /*
    
    Frame - Yellow, clock -> active
    Frame - Yellow, clock pulse -> active, transfer data
    Frame - Yellow, time, -> overwritten
    Frame - Yellow, time, pulse -> overwritten, transfer data
    Frame - red, noconnection pulse -> noconnection
    
    */
    
function getDuration(t1, t2) {
    var delta = Math.abs(t1 - t2) / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;  // in theory the modulus is not required    

    return [hours, minutes];
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
        return $("");
    }
    
    updateView() {
        $("div", this.$html).replaceWith(this.buildHTML(this.day));
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
            $("div", this.$html).replaceWith(this.buildHTML());
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
        var html = ''

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
        var html = ''
        html += '<svg viewBox="-100 -100 200 200">';
        html += '  <circle id="clockface" r="80"  />';
        html += '</svg>';
        return $(html);
    }
    
    buildOffIcon() {
        var html = ''
        html += 'power_settings_new';
        return $(html);
    }
    
    buildNoConnectionIcon() {
        var html = ''
        html += '<svg viewBox="-100 -100 200 200">';
        html += '  <circle id="clockface" r="80"  />';
        html += '</svg>';
        return $(html);
    }
        
    buildHTML() {
        var html = ''
        html += '<div class="control tooltip" data-position="right" data-tooltip="long click to open the configuration">';

        if(!this.object) {
            html += '<a class="pulse btn-floating btn-large waves-effect waves-light grey"><i class="large material-icons ">access_time</i></a>';
        } else if (!this.adapter.active) {
            html += '<a class="pulse btn-floating btn-large waves-effect waves-light red"><i class="large material-icons ">portable_wifi_off</i></a>';
            this.getParent().getContainer().removeClass("active").removeClass("inactive").addClass("offline");
        } else if (!this.config.active) {
            html += '<a class="btn-floating btn-large waves-effect waves-light grey"><i class="large material-icons ">power_settings_new</i></a>';
            this.getParent().getContainer().removeClass("active").addClass("inactive").removeClass("offline");
        } else if (this.object.overwrittenTill) {
            let duration = getDuration(this.object.overwrittenTill, new Date());
            html += '<a class="pulse btn-floating btn-large waves-effect waves-light red"><span class="duration" data-till="' + this.object.overwrittenTill + '">' + duration[0] + "h" + duration[1] + 'm</a>';
        } else {
            html += '<a class="pulse btn-floating btn-large waves-effect waves-light yellow"><i class="large material-icons ">access_time</i></a>';
            this.getParent().getContainer().addClass("active").removeClass("inactive").removeClass("offline");
        }
        
        html += '</div>';

        return html;
    }
    
    destroy() {
        clearInterval(this.timer);
    }
    
    updateView() {
        this.destroy();
        $("div", this.$html).replaceWith(this.buildHTML());
        this.postRenderAction();
    }
    
    postRenderAction() {
        var view = this;
        var timer = null;
        var pressStatus = 0;
        
        if(!this.object) {
            return;
        }
        
        if (this.object.overwrittenTill) {
            let $durationElem = $(".duration", this.$html);
            let time = $durationElem.attr("date-till");

            this.timer = setInterval(function(){
                let duration = getDuration(view.object.overwrittenTill, new Date());
                $durationElem.html(duration[0] + "h" + duration[1] + "m");
            }, 1000);
        }
        
        let $control = $(".control", this.$html);
        let dtFormater = new Intl.DateTimeFormat('de', {year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });
        
        
        $control.on("mouseenter", function() {
            if(view.object.overwrittenTill) {
                $control.attr("data-tooltip", "Value Overwritten until: " + dtFormater.format(new Date(view.object.overwrittenTill)));
                var elem = document.querySelector('.tooltip');
                var instance = M.Tooltip.init($control[0], {
                    enterDelay: 0
                });
                instance.open();
            }
        }).on("mousedown", function() {
            pressStatus = 1;
            var instance;
            timer = setTimeout(function(){
                pressStatus = 2;
                
                if(view.editable) {
                    view.parent.route("collabsible", true, null, "modal");
                    view.parent.route("timeline", true, null, "collabsible:0", true);
                    view.parent.route("configuration", true, null, "collabsible:1");
                } else {
                    view.parent.route("collabsible", false, null, "modal");
                    view.parent.route("timeline", false, null, "collabsible:0", true);
                }
            }, 1500);
        }).on("mouseup mouseleave", function() {
            clearTimeout(timer);
            
            if(pressStatus == 1) {
                
                $control.attr("data-tooltip", "long click to open the configuration");
                var instance = M.Tooltip.init($control[0], {
                    enterDelay: 0
                });
                instance.open();
            }
            
            pressStatus = 0;
        })
    }
    
    render($container, editable) {
        this.editable = editable;
        let view = this;
        
        if (!this.$html || !this.$html.length) {
            this.$html = $('<div></div>');
            this.$html.append(this.buildHTML());
            $container.append(this.$html);
        } else {
            $("div", this.$html).replaceWith(this.buildHTML());
        }
        
        this.postRenderAction();
        $container.addClass("yellowframe");
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

        this.stepWidth = parseInt(viewconfig.valueBoxWidth / viewconfig.dayHourTill - viewconfig.dayHourFrom / viewconfig.dayHourStep);
        this.stepHeight = viewconfig.valueBoxHeight - (viewconfig.valueBoxPadding * 2);
    }

    getParent() {
        return this.parent;
    }
    
    updateData(data) {
        this.scedule = data.scedule;
        this.object = data.object;
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
        value = value > this.viewconfig.maxValue ? this.viewconfig.maxValue : value;
        value = value < this.viewconfig.minValue ? this.viewconfig.minValue : value;
        
        return (this.viewconfig.valueBoxHeight - this.viewconfig.valueBoxPadding * 2) - ((this.viewconfig.valueBoxHeight - this.viewconfig.valueBoxPadding * 2) / (this.viewconfig.maxValue - this.viewconfig.minValue))*(value-this.viewconfig.minValue);
    }
    
    
    parseTimeString(timeStr) {
        if(timeStr.indexOf(":") <= 0) {
            timeStr = timeStr.split("|");
            timeStr = new Date(this.getParent().astrotimes[timeStr[0]].getTime() + (timeStr[1] ?  timeStr[1]*60*1000 : 0)).toLocaleTimeString("de-de", {hour: "2-digit", minute: "2-digit"})
        }
        
        return timeStr
    }
    
    lastDaysValue() {
        let mode = Object.keys(this.scedule).length; // 8, 3, 2;
        let days = ["off"];
        let value = 0;
        
        if(this.day !== "off") {
            switch(mode) {
                case 8:
                    days = ["mo", "tu", "we", "th", "fr", "sa", "su"];
                    break;
                case 3:
                    days = ["mo", "su"];
                    break;
                case 2:
                    days = ["mo"];
                    break;
            }
        }
        
        let index = days.findIndex((d) => d == this.day);
        let lastDay = index - 1 < 0 ? days.length - 1 : index - 1;
        let lastSceduleDay = this.getOrderedScedule(lastDay);
        value = lastSceduleDay[lastSceduleDay.length - 1];
        
        return value[3];
    }
    
    
    getOrderedScedule(day) {
        let view = this;
        var scedule = this.scedule[this.day];
        var sortable = [];
        
        Object.entries(scedule).forEach(([timeStr, value]) => {
            let isAstro = !(timeStr.indexOf(":") > 0 && timeStr.length == 5);
            let timeStr2 = view.parseTimeString(timeStr);
            let time = new Date('01 Jan 1970 ' + timeStr2 + ':00 GMT').getTime() / 1000;
            
            timeStr = timeStr.split("|");
            
            if(!isAstro) {
                timeStr = timeStr[0];
            } else if(timeStr.length == 1 || timeStr[1] == 0) {
                timeStr = timeStr2 + " (" + timeStr[0] + ")";
            } else {
                timeStr = timeStr2 + " (" + timeStr[0] + " " + (timeStr[1] > 0 ? "+" : "") + timeStr[1] + "min)";
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
            let isAstro = !(value[1].indexOf(":") > 0 && value[1].length == 5);
            let xPos = this.getHorizontalPosition(value[0]);
            let yPos = this.getVerticalPosition(value[3]);
            
            html += ' L' + xPos + ',' + yPosLast;
            html += ' L' + xPos + ',' + yPos;
            
            yPosLast = yPos;
            let timeStr =  value[1].split("|");
            
            html_pins += '    <g transform="translate(' + xPos + ', 0)" class="' + (isAstro ? "astro " : "") + ' tooltipped" data-position="right" data-tooltip="' + value[1] + '">';
            
            if (isAstro) {
                html_pins += '      <use xlink:href="#astropointer" /> ';
            } else { 
                html_pins += '      <use xlink:href="#pointer" /> ';
            }
                                                                                  
            html_pins += '      <text x="20" y="30" font-size="20" text-anchor="middle" fill="#ffffff">' + value[3] + this.viewconfig.dataSign + '</text>';
            html_pins += '    </g>';
        })
        
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
            let isAstro = !(value[1].indexOf(":") > 0 && value[1].length == 5);
            let xPos = this.getHorizontalPosition(value[0]);
            
            html += '<rect x="' + xPosLast + '" y="0" width="' + (xPos - xPosLast) + '" height="30" fill="' + (lastValue ? "yellow": "grey") + '" class="' + (lastValue ? "on": "off") + '" />';
            
            lastValue = value[3];
            
            xPosLast = xPos;

            html_pins += '    <g transform="translate(' + xPos + ', 0)" class="' + (isAstro ? "astro " : "") + ' tooltipped" data-position="right" data-tooltip="' + value[1] + '">';
            
            if (isAstro) {
                html_pins += '      <use xlink:href="#astropointer" /> ';
            } else { 
                html_pins += '      <use xlink:href="#pointer" /> ';
            }
                                                                                  
            html_pins += '      <text x="20" y="30" font-size="20" text-anchor="middle" fill="#ffffff">' + (value[3] ? "on" : "off") + '</text>';
            html_pins += '    </g>';
        });
        
        html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="30" fill="' + (lastValue ? "yellow": "grey") + '" class="' + (lastValue ? "on": "off") + '" />';
        
        /*
        html += '<rect x="' + xPosLast + '" y="0" width="' + (this.viewconfig.valueBoxWidth - xPosLast) + '" height="60" fill="#ff0000" class="' + (value[3] ? "on": "off") + '" >';
        */
        
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

    buildHTML() {
        var html = '';
        
        //html += '<div>';
        //html += 'Monday';
        //html += '</div>';
        html += '<div class="row ' + this.day + '">';
        html += '<div class="col ' + (this.editable ? "s11" : "s12") + '">';
        html += '<svg class="timeline" viewBox="-5 0 760 140">';
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
          html += '    <text x="' + (this.stepWidth * h) + '" y="0" font-size="20" text-anchor="middle" fill="#808080">' + h + 'h</text>';
        }

        html += '  </g>';
        html += '  <g transform="translate(20, 70)" >';
        html += '    <path fill="none" stroke="#d8d8d8" stroke-width= "4" d="';

        for (var h = this.viewconfig.dayHourFrom; h <= this.viewconfig.dayHourTill; h += this.viewconfig.dayHourStep) {
          html += '      M ' + (this.stepWidth * h) + ',0 L ' + (this.stepWidth * h) + ',40';
        }

        html += '      " />';
        html += '</g>';
        
        if (this.object.type == "number") {
            html += this.renderTimelineData_number();
        } else if (this.object.type == "boolean") {
            html += this.renderTimelineData_boolean();
        }
        
        html += '</svg>';
        html += '</div>';
        
        if(this.editable) {
            html += '<div class="col s1">';
            html += '<a class="menu btn-floating btn-small waves-effect waves-light"><i class="small material-icons">menu</i></a>';
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
        
        $(".menu", this.$html).on("click", function(e) {
            if(view.editable) {
                let modal = view.$html.parent(".modal");
                
                if(modal && modal.length) {
                    view.getParent().route("collabsible", true, view.day, "modal", true);
                    view.getParent().route("sceduleconfiguration", true, view.day, "collabsible:0", true);
                } else {
                    view.getParent().route("sceduleconfiguration", true, view.day, "collabsible:1", true);
                }

            }
        });
        
        $('.tooltipped').tooltip();
        
        /*this.getParent().getContainer().on("change", function(e, data) {
            if(data && data.scedule && data.scedule[view.day]) {
                view.scedule[view.day] = data.scedule[view.day];
                view.updateView();
            }
        });*/
    }
                                           
    updateView() {
        if(!this.day) {
            return
        }
        
        $("div", this.$html).replaceWith(this.buildHTML(this.day));
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
            $("div", this.$html).replaceWith(this.buildHTML());
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
        this.day = "";
    }
    
    getParent() {
        return this.parent;
    }
    
    updateData(data) {
        this.scedule = data.scedule;
        this.object = data.object;
        this.astrotimedata = data.astrotimedata;
    }
    
    getFormData() {
        let view = this;
        let config = {};
        
        $("form > .row", this.$html).each(function( index ) {
            let value = 0;
            let time = $("*[name=time]", this).val();
            
            if (view.object.type == "number") {
                value = $("*[name=value]", this).val();
            } else if (view.object.type == "boolean") {
                value = $("*[name=value]", this).prop("checked")
            }
            
            if($(this).hasClass("astrotime")) {
                let shift = $("*[name=shift]", this).val();
                
                if (time && value || time && view.object.type == "boolean") {
                    config[time + "|" + shift] = value;
                }
            } else {
                if (time && value || time && view.object.type == "boolean") {
                    config[time] = value;
                }
            }
        });
        
        return config;
    }
    
    buildFormTimeEntry(time, value) {
        let html = '';
        html += '  <div class="row time">';
        html += '    <div id="' + this.entryCnt + '" class="col input-field s6">';
        html += '       <input id="time' + this.entryCnt + '" name="time" type="text" class="form-control bs-timepicker validate" value="' + time + '">';
        html += '       <label for="time' + this.entryCnt + '">Time</label>';
        html += '    </div>';
        
        if(this.object.type == "number") {
            html += '    <div class="col input-field s4">';
            html += '      <input id="value' + this.entryCnt + '" type="number" min="10" max="100" name="value" class="validate" value = "' + value + '">';
            html += '      <label for="value' + this.entryCnt + '">Value ' + this.viewconfig.dataSign + '</label>';
            html += '    </div>';
        } else if(this.object.type == "boolean") {
            html += '    <div class="col input-field s4 switch">';
            html += '      <label>';
            html += '        off';
            html += '        <input id="value' + this.entryCnt + '" type="checkbox" name="value" class="validate" ' + (value ? "checked" : "") + '>';
            html += '        <span class="lever"></span>';
            html += '        on';
            html += '      </label>';
            html += '    </div>';
        }
        
        html += '    <div class="col s2 valign-right">';
        html += '      <a class="delete btn-floating btn-small waves-effect waves-light red"><i class="small material-icons">delete</i></a>';
        html += '    </div>';
        html += '  </div>';
        
        this.entryCnt++;
        
        return html;
    }    
    
    buildFormAstrotimeEntry(timeValue, value) {
        timeValue = timeValue.split("|");
        
        let html = '';
        html += '  <div id="' + this.entryCnt + '" class="row astrotime">';
        html += '    <div class="col input-field s4">';
        html += '      <select name="time">';
        html += '         <option value="" disabled></option>';
        
        Object.entries(this.getParent().astrotimes).forEach(([name, time]) => {
            html += '         <option value="' + name + '"' + ( name == timeValue[0] ? " selected" : "")+ '>' + name + ' ('+ time.toLocaleTimeString("de-de", {hour: "2-digit", minute: "2-digit"}) +')</option>';
        });
        
        html += '       </select>';
        html += '       <label for="time' + this.entryCnt + '">Astro</label>';
        html += '    </div>';
        html += '    <div class="col input-field s2">';
        html += '      <input id="shift' + this.entryCnt + '" type="number" min="-120" max="120" name="shift" class="validate" value = "' + (timeValue[1] ? timeValue[1] : "0") + '">';
        html += '      <label for="shift' + this.entryCnt + '">Shift min</label>';
        html += '    </div>';
        
        if(this.object.type == "number") {
            html += '    <div class="col input-field s4">';
            html += '      <input id="value' + this.entryCnt + '" type="number" min="10" max="100" name="value" class="validate" value = "' + value + '">';
            html += '      <label for="value' + this.entryCnt + '">Value ' + this.viewconfig.dataSign + '</label>';
            html += '    </div>';
        } else if(this.object.type == "boolean") {
            html += '    <div class="col input-field s4 switch">';
            html += '      <label>';
            html += '        off';
            html += '        <input id="value' + this.entryCnt + '" type="checkbox" name="value" class="validate" ' + (value ? "checked" : "") + '>';
            html += '        <span class="lever"></span>';
            html += '        on';
            html += '      </label>';
            html += '    </div>';
        }
    
        html += '    <div class="col s2 valign-right">';
        html += '      <a class="delete btn-floating btn-small waves-effect waves-light red"><i class="small material-icons">delete</i></a>';
        html += '    </div>';
        html += '  </div>';
        
        this.entryCnt++;
        
        return html;
    }
    
    buildHTML() {
        let html = '';
        let showPaste = localStorage.getItem("scedule");
        
        html += '<div class="row">';
        //html += '  <div class="title">' + this.day + '</div>'
        html += '  <form action="#">';

        Object.entries(this.scedule[this.day]).forEach(([time, value]) => {
            let isAstro = !(time.indexOf(":") > 0 && time.length == 5);
            
            if(isAstro) {
                html += this.buildFormAstrotimeEntry(time, value);
            } else {
                html += this.buildFormTimeEntry(time, value);
            }
        });
        
        html += '  </form>';
        html += '  <div class="">';
        html += '    <div class="col input-field s12">';
        html += '      <a class="dropdown-trigger btn" href="#" data-target="dropdown1"><i class="material-icons">menu</i></a>';
        html += '      <ul id="dropdown1" class="dropdown-content">';
        html += '        <li><a href="#!" class="addtime"><i class="material-icons">playlist_add</i>Time</a></li>';
        html += '        <li><a href="#!" class="addastrotime"><i class="material-icons">playlist_add</i>Astrotime</a></li>';
        html += '        <li class="divider" tabindex="-1"></li>';
        html += '        <li><a href="#!" class="copy"><i class="material-icons">content_copy</i>copy</a></li>';
        
        if(showPaste) {
            html += '        <li><a href="#!" class="paste disable"><i class="material-icons">content_paste</i>paste</a></li>';
        }
        
        html += '      </ul>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
        
        return html;
    }
    
    pushUpdate() {
        let config = {};
        config["scedule"] = {};
        config["scedule"][this.day] = this.getFormData();
        this.getParent().getContainer().trigger("change", config);
    }
    
    postRenderAction() {
        let view = this;
        
        $('.bs-timepicker', this.$html).timepicker({twelveHour: this.viewconfig.showMedian});
        //$('.dropdown-trigger', this.$html).dropdown();
        
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, {});
        
        $("select", this.$html).formSelect();

        $('.delete', this.$html).on("click", function() {   
            $(this).parent().parent().remove();
            view.pushUpdate();
            //callback("scedule", config);
        });
        
        $("input, select, textarea", this.$html).on("change", function() {
            view.pushUpdate();
            //callback("scedule", config);
        });
        
        M.updateTextFields();
    }
    
    updateView() {
        if(!this.$html || !this.day || !this.scedule) {
            return
        }
        
        $("div", this.$html).replaceWith(this.buildHTML(this.day));
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
            $("div", this.$html).replaceWith(this.buildHTML(this.day));
        }
        
        $container.append(this.$html);
        view.postRenderAction();

        $('.addtime', this.$html).on("click", function() {
            $("form", this.$html).append(view.buildFormTimeEntry("", ""));
            view.postRenderAction();
        });
        
        $('.addastrotime', this.$html).on("click", function() {
            $("form", this.$html).append(view.buildFormAstrotimeEntry("", ""));
            view.postRenderAction();
        });
        
        $('.copy', this.$html).on("click", function() {
            let config = view.getFormData();
            localStorage.setItem("scedule", JSON.stringify(config));
        });
        
        $('.paste', this.$html).on("click", function() {
            view.scedule[view.day] = JSON.parse(localStorage.getItem("scedule"));
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
    }
    
    getFormData() {
        let view = this;
        
        return {config: {
            active: $("input[name=active]", view.$html).prop("checked"),
            template: $("select[name=template]", view.$html).val(),
            overrideBehavior: $("select[name=overrideBehavior]", view.$html).val(),
            considerOffDays: $("input[name=considerOffDays]", view.$html).prop("checked"),
            onlyIfGuest: $("input[name=onlyIfGuest]", view.$html).prop("checked"),
            considerOwnRule: $("input[name=considerOwnRule]", view.$html).prop("checked"),
            ownRule: $("textarea[name=ownRule]", view.$html).val()
        }}
    }
    
    updateView() {
        if(!this.$html) {
            return
        }
        
        $("div", this.$html).replaceWith(this.buildHTML(this.day));
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
        html += '          Active: Off';
        html += '          <input type="checkbox" name="active" />';
        html += '          <span class="lever"></span>';
        html += '            On';
        html += '        </label>';
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="row">';
        html += '    <div class="input-field col s12 m6">';
        html += '      <select name="template">';
        html += '        <option value="null" disabled selected>Choose your option</option>';
        html += '        <option value="full">Full week + Off</option>';
        html += '        <option value="min">Workdays, Weekend + Off</option>';
        html += '        <option value="singe">Single Day + Off</option>';
        html += '      </select>';
        html += '      <label>Template</label>';
        html += '    </div>';
        html += '    <div class="input-field col s12 m6">';
        html += '      <select name="overrideBehavior">';
        html += '        <option value="null" disabled selected>Choose your option</option>';
        html += '        <option value="1 Hour">1 Hour</option>';
        html += '        <option value="2 Hours">2 Hours</option>';
        html += '        <option value="4 Hours">4 Hours</option>';
        html += '        <option value="next change">Next Change</option>';
        html += '      </select>';
        html += '      <label>Overwrite behavier</label>';
        html += '    </div>';
        html += '    <div class="col s12">';
        html += '      <p>';
        html += '      <label>';
        html += '        <input type="checkbox" name="considerOffDays" class="filled-in" checked="checked" />';
        html += '        <span>considerOffDays</span>';
        html += '      </label>';
        html += '      </p>';
        html += '      <p>';
        html += '      <label>';
        html += '        <input type="checkbox" name="onlyIfGuest" class="filled-in" checked="checked" />';
        html += '        <span>onlyIfGuest</span>';
        html += '      </label>';
        html += '      </p>';
        html += '      <p>';
        html += '      <label>';
        html += '        <input type="checkbox" name="considerOwnRule" class="filled-in" checked="checked" />';
        html += '        <span>considerOwnRule</span>';
        html += '      </label>';
        html += '      </p>';
        html += '    </div>';
        html += '    <div class="col s12">';
        html += '      <textarea id="textarea1" class="materialize-textarea" name="ownRule"></textarea>';
        html += '      <label for="textarea1">ownRule</label>';
        html += '    </div>';
        html += '  </div>';
        html += '</form>';
        html += '</div>';
        
        return html;
    }
    
    pushUpdate() {
        let config = this.getFormData();
        this.getParent().getContainer().trigger("change", config);
    }
    
    postRenderAction() {
        let view = this;
        
        if(this.config) {
            $("input[name=active]", this.$html).prop("checked", this.config.active);       
            $("select[name=template]", this.$html).val(this.config.template);
            $("select[name=overrideBehavior]", this.$html).val(this.config.overrideBehavior);
            $("input[name=considerOffDays]", this.$html).prop("checked", this.config.considerOffDays);
            $("input[name=onlyIfGuest]", this.$html).prop("checked", this.config.onlyIfGuest);
            $("input[name=considerOwnRule]", this.$html).prop("checked", this.config.considerOwnRule);
            $("textarea[name=ownRule]", this.$html).val(this.config.ownRule);
        }
        
        try {
            M.updateTextFields();
            $("select", this.$html).formSelect();
            M.textareaAutoResize($("textarea", this.$html));
        } catch(e) {
            console.log("yellowframe_Viewclass_configuration -> postRenderAction");
        }
        
        this.$html.find("input, select, textarea").change(function() {
            view.pushUpdate();
        });
    }
    
    render($container) {
        var view = this;

        if (!this.$html || !this.$html.length) {
            this.$html = $('<div></div>');
            this.$html.append(this.buildHTML());
        } else {
            $("div", this.$html).replaceWith(this.buildHTML());
        }
        
        $container.append(this.$html);
        this.postRenderAction();
        
        return this.$html;
    }
}

    
class yellowframe_Viewclass_Timeline_Set {
    constructor(parent, viewconfig) {
        this.parent = parent;
        this.viewconfig = viewconfig;
        this.$html;
        this.timelines = {};
        this.data;
        this.scedule;
    }
    
    parent() {
        return this.viewconfig;
    }
    
    updateData(data) {
        this.data = data;
        this.scedule = data.scedule;
        
        Object.entries(this.timelines).forEach(([day, timelineView]) => {
            timelineView.updateData(data);
        });
    }
    
    updateView() {
        Object.entries(this.timelines).forEach(([day, timelineView]) => {
            timelineView.updateView();
        });
    }
    
    postRenderAction() {
        
    }
    
    render($container, editable) {
        let days = Object.keys(this.timelines);
        let view = this;
        
        Object.entries(this.scedule).forEach(([day, scedule]) => {
            days.splice(days.indexOf(day), 1);
            
            if(!view.timelines[day]) {
               view.timelines[day] = new yellowframe_Viewclass_Timeline(view.parent, this.viewconfig);
               view.timelines[day].singleView = false;
            }
            
            view.timelines[day].updateData(view.data);
            
            if(day == "off") {
                $container.append('<div class="row"><div class="divider"></div></div>');
            }
            
            view.timelines[day].render($container, day, editable);
        });
        
        days.forEach(function(day) {
            view.timelines[day].remove();
            delete view.timelines[day];
        }) 
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
      html += '  <div class="modal-header">';
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
            this.$html = $('<div id="modal"></div>');
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
        // DO Stuff
    }
    
    updateView() {
        $("div", this.$html).replaceWith(this.buildHTML(this.day));
        this.postRenderAction();
    }
    
    getInstance() {
        return M.Collapsible.getInstance(document.querySelector('.collapsible'));
    }
    
    postRenderAction() {
        let view = this;
        
        var instances = M.Collapsible.init(document.querySelectorAll('.collapsible'), {
            onOpenStart: function(e) {
                if($(e).attr("data-template") == "timeline" && view.editable) {
                    view.parent.route("configuration", true, null, "collabsible:1", false);
                }
            }
        });

        if(typeof instances === "object") {
            this.collapsible = instances[0];
        } else {
            this.collapsible = instances;
        }
    }
    
    appendEntry(colId, title, templateName) {
        let $col = $(".col" + colId, this.$html);
        $col.attr("data-template", templateName);
        
        if(!$col.length) {
            $col = $(this.buildHTMLElement(colId, title));
            $(".collapsible", this.$html).append($col);
        } else {
            $(".collapsible-header", $col).html(title);
        }
        
        return $(".collapsible-body", $col);
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
        html += '  <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>';
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
            $("> div", this.$html).replaceWith(view.buildHTML());
        }
        
        $("li", this.$html).remove();
        
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
      this.scedule = data.scedule;
      this.astrotimes = SunCalc.getTimes(new Date(), this.astrotimedata.latitude, this.astrotimedata.longitude);
  }
    
    updateViews() {
      this.configurationView.updateView();
      this.sceduleconfigurationView.updateView();
      this.timelineSetView.updateView();
      this.timelineView.updateView();
      this.frameView.updateView();
    }

    getTodaysSceduleDay(date) {
        if(!date) { date = new Date() }
        
        let mode = Object.keys(this.scedule).length; // 8, 3, 2;
        let days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
        let today = days[date.getDay()];
        let workdays = ["mo", "tu", "we", "th", "fr"];
        
        if(this.day == "off") {
            return "off";
        } else {
            switch(mode) {
                case 8:
                    return this.day;
                    break;
                case 3:
                    if(workdays.includes(today)) {
                        return "mo";
                    } else {
                        return "so";
                    }
                    break;
                case 2:
                    return "mo";
                    break;
            }
        }
    }
    
  route(template, editable, day, target, open) {
    if (typeof editable === "undefined") {
        editable = true;
    }
      
    if (typeof open === "undefined") {
        open = false;
    }
      
    if (typeof target === "undefined") {
        target = this.$container;
    }
    
    let collabsibleOpen = -1;
      
    if(typeof target === "string") {
        target = target.split(":");
        
        switch (target[0]) {
            case "modal":
                this.modalView.render($("body"));
                $(">.modal>.modal-header", this.modalView.$html).html("OID: " + this.object.id);
                target = $(">.modal>.modal-content", this.modalView.$html);
                this.modalView.$html.attr("data-template", template);
                target.empty();
                //return this.route(template, editable, day, $html);
                break;
            case "collabsible":
                collabsibleOpen = open ? target[1] : -1;
                let title = '<i class="material-icons">filter_drama</i>' + template + (day ? " (" + day + ")" : "");
                target = this.collabsibleView.appendEntry(target[1], title, template)
                target.empty();
                break;
            default:
                target = this.$container;
                break;
        }
    }
            
    if(typeof target === "object") {
        switch (template) {
            case "frame":
                this.frameView.render(target, editable);
                break;
            case "collabsible":
                this.collabsibleView.render(target, editable);
                break;
            case "timeline_single":
                this.timelineView.render(target, day, editable);
                break;
            case "timeline_single_today":
                this.timelineView.render(target, this.getTodaysSceduleDay(), editable);
                break;
            case "timeline":
                this.timelineSetView.render(target, editable);
                break;
            case "sceduleconfiguration":
                this.sceduleconfigurationView.render(target, day);
                break;
            case "configuration":
                this.configurationView.render(target);
                break;
            default:
                // code block
                break;
        }
    }
      
    if(collabsibleOpen > -1) {
        this.collabsibleView.getInstance().open(collabsibleOpen);
    }
  }
}

    
// this code can be placed directly in yellowframe.html
vis.binds["yellowframe"] = {
    version: "0.0.1",
    $div: null,
    showVersion: function () {
        if (vis.binds["yellowframe"].version) {
            console.log("Version yellowframe: " + vis.binds["yellowframe"].version);
            vis.binds["yellowframe"].version = null;
        }
    },

    ObjectBind: function(oid) {
        // subscribe on updates of value
        function onChange(e, newVal, oldVal) {
            alert("IOD->Value Changed");
        }

        if (oid) {
            if(vis.states) {
              vis.states.bind(oid + ".val", onChange);
            }
            
            //remember bound state that vis can release if didnt needed
            vis.binds["yellowframe"].$div.data("bound", [oid + ".val"]);
            //remember onchange handler to release bound states
            vis.binds["yellowframe"].$div.data("bindHandler", onChange);
        }
    },

    createFrameWidget: function (widgetID, view, data, style) {
        var $div = $("#" + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds["yellowframe"].createFrameWidget(widgetID, view, data, style);
            }, 100);
        }

        //var yellowframe = new yellowframe_widget($div);

        //$div.append(yellowframe.route("frame_active"));
    },

    createTimelineWidget: function (widgetID, view, data, style) {

        // if nothing found => wait
        if (!$("#" + widgetID).length) {
            return setTimeout(function () {
                vis.binds["yellowframe"].createTimelineWidget(widgetID, view, data, style);
            }, 100);
        }
    
        //vis.binds["yellowframe"].ObjectBind();
        
        var viewconfig = {};
        viewconfig.widgetWidth = 800;
        viewconfig.valueBoxWidth = 720;
        viewconfig.valueBoxHeight = 50;
        viewconfig.valueBoxPadding = 5;
        viewconfig.dayHourFrom = 0;
        viewconfig.dayHourTill = 24;
        viewconfig.dayHourStep = 2;
        viewconfig.minValue = 12;
        viewconfig.maxValue = 28;
        viewconfig.dataRole = "heat"; // Value, Heat, Percentage, Binary
        viewconfig.dataSign = "°C"; // _, %, °C, etc.
        viewconfig.editButton = true;
        viewconfig.showMedian = false;
        viewconfig.editable = false;
        

/*

Object

*/
        
        var yellowframe = new yellowframe_router($("#" + widgetID), viewconfig);
        
        var adapterData = {
            adapter: false
        };


        yellowframe.route("frame", true);
        
        vis.states.bind("system.adapter.yellowframe.0.alive", function(e, newVal) {
            toast({html: "adapter Status"})
        });


        vis.conn.sendTo("yellowframe.0", "getObject", {id: data.oid}, function(a){
            console.log(a);
            adapterData = a.data;
            adapterData.adapter = {};
            adapterData.adapter.active = true;
            
            adapterData.timeDifferenz = new Date().getTime() - adapterData.adapterTime;
            
            if(vis.states) {
                vis.conn.subscribe(adapterData.shadowstate);
                
                vis.states.bind(adapterData.shadowstate + ".val", function(e, newVal) {
                    M.toast({html: "recive update from " + adapterData.object.id })
                    console.log("Shadow object has been changed");
                    let data = JSON.parse(newVal);
                    console.log(data);
                    adapterData.config = data.config;
                    adapterData.scedule = data.scedule;
                    adapterData.object = data.object;
                    
                    yellowframe.update(adapterData);
                    yellowframe.updateViews();
                });
            }
                        
            yellowframe.update(adapterData);
            //yellowframe.route("collabsible", true, null, "modal");
            //yellowframe.route("timeline", true, null, "collabsible:0", true);
            //yellowframe.route("sceduleconfiguration", true, "mo", "collabsible:1");
            yellowframe.frameView.updateView();
        });
        
        /*
        
        - Use abstract viewclass 

        - Create Status Header
        - Handle Translations
        - QT Comments
        
        
        */
        
        //yellowframe.route("collabsible", null, "modal");
        //yellowframe.route("timeline", null, "collabsible:0", true);
        //yellowframe.route("configuration", null, "collabsible:1", false);
        
        //yellowframe.route("timeline_single", "su");
        //yellowframe.route("sceduleconfiguration", "su");
        //yellowframe.route("timeline");
        
        $("#" + widgetID).on("change", function(e, newData) {
            if(typeof newData !== "undefined") {
                if(newData.scedule) {
                    Object.entries(newData.scedule).forEach(([day, scedule]) => {
                        adapterData.scedule[day] = scedule;
                    });
                    
                    let request = {
                        id: data.oid,
                        scedule: newData.scedule
                    };
                    
                    vis.conn.sendTo("yellowframe.0", "setScedule", request, function(a) {
                        M.toast({html: "send scedule (" + data.oid + ") " + JSON.stringify(a)})
                    });
                    
                    yellowframe.timelineSetView.updateView();
                    yellowframe.timelineView.updateView();
                }
                
                if(newData.config) {
                    adapterData.config = newData.config;
                    console.log(newData.config);
                    
                    let request = {
                        id: data.oid,
                        config: newData.config
                    };
                    
                    vis.conn.sendTo("yellowframe.0", "setConfig", request, function(a) {
                        M.toast({html: "send config (" + data.oid + ") " + JSON.stringify(a)})
                    });
                    
                    yellowframe.update(adapterData);
                    yellowframe.frameView.updateView();
                }
            }
        });
    }
};

vis.binds["yellowframe"].showVersion();
    
});