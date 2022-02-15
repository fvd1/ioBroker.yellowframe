
/*

        var adapterData = {
           "userdata":{
               "latitude": 51.26086,
               "longitude": 6.5619
           },
           "adapter":{
               active: true,
               isOffDay: true,
               adapterTime: new Date().getTime()//,
               //overwrittenFrom: new Date().getTime() - (1*60 + 36) * 60 * 1000,
               //overwrittenTill: new Date().getTime() + (2*60 + 24) * 60 * 1000
           },
           "config":{
              "active":false,
              "template":"min",
              "overrideBehavior":"4 Hours",
              "considerOffDays":true,
              "onlyIfGuest":false,
              "considerOwnRule":false,
              "ownRule":"TEST\nNext Row\nther Row",
           },
           "scedule":{
              "mo":{
                 "06:00":21,
                 "07:30":16,
                 "15:00":21,
                 "19:00":16
              },
              "su":{
                 "08:00":21,
                 "20:00":15
              },
              "off":{
                 "00:00":12
              }
           }
        };
*/

/*

getTodaysSceduleDay() {
	let mode = Object.keys(this.scedule).length; // 8, 3, 2;
	let days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
	let today = days[new Date().getDay()];
	let workdays = ["mo", "tu", "we", "th", "fr"];

	if(this.day == "off") {
		return "off";
	} else {
		switch(mode) {
			case 8:
				return this.day;
				break;
			case 3:
				if(workdays.findIndex(today) > 0) {
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
        let lastSceduleDay = Object.values(this.scedule[days[lastDay]]);
        
        value = lastSceduleDay[lastSceduleDay.length - 1];
        
        return value;
    }

*/
/*

adapterStart

getObject
	checkifFrameObjectExsists
		if not create Object.
	buildJSON
	return JSON

onChange(orig Object)
	getFrameObject (Parent)
	checkJSON
	check for Overwritten State
	changeChangedTime for Frame (force Wiget Update)

onChange(yellowframe.*)
	getFrameObject (Parent)
	buildJSON
	saveJSON
	changeChangedTime for Frame (force Wiget Update)
	Tick

tick (every minute / 10sec)
	For every Frame ->
		check last update time
		check scedule for current Value
		do changes
			if last time behind scedule event
			if last time behind last orig object (missed overwrite)
			if last orig object change behind scedule event (missed change)
		if there are changes
			changeChangedTime for Frame (force Wiget Update)

setConfig / setScedule
	-> do onChange(yellowframe.*)

*/