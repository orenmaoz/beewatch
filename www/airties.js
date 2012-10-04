//2011 - 2012 BNJ 

var macIII = 0;

function genGreyBar(startsec,macII) {
	var i = startsec; //unix startime
	var f = i + 86100; //length of the bar = ~24h
	while ( i <= f) {
		document.write('<div id='+ i + '_' + macII + ' title="no info" class="st"></div>');
		i = i + 300; //5min jump
	}
}

function calcDisplay(mode,uxdate,macII) {
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "Maj", "Juni", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var now = new Date();
	var date = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var foo = new Date(year, month, date, 0, 0, 0, 0); //find beginning of day
	var unixtime_ms = foo.getTime(); // Returns milliseconds
	var unixtime = Math.floor(unixtime_ms * 0.001); //returns seconds since epoc
	if (daysago) {
		unixtime = unixtime - (86400 * daysago);
	}
	if (mode == 'days') {
		var daysec = uxdate * 86400; //amout of sec to process
		unixtime = unixtime + 86400; //adding an extra day, to wiew the present day
		var startsec = unixtime - daysec;

		while ( startsec < unixtime) {
			genGreyBar(startsec,macII);
			var humanDate = new Date (startsec*1000);
			document.write('<div class="date">' + humanDate.getDate() + ' ' + monthNames[humanDate.getMonth()] + ' ' + macII + '</div><br />');
			startsec = startsec + 86400;
		}
	}
}

function showInfo(){
	var lasttime = 0;
	var uptime = 0;
	var lastErr = 0;
	var stbErr = new Array();
	var errorList = new Array();
	errorList = ['badStream', 'ddecodeDrops','decodeErr', 'decodeOflow', 'displayDrops','displayErr','displayOflow','iframeErr','ptsDrops','ptsOflow','stalled'];
	$.each(data, function(index, JSONvalue) {
		var error5min = 0;
		var missingMcast = 0;
		var rtsperr = 0;
		var invaliddata = 0;
		invaliddata = data[index]['invaliddata'];
		missingMcast = data[index]['mcast'];
		rtsperr = data[index]['rtsperr'];
		var err = 0;
		for(key in JSONvalue) {
			//construct errors array
			if ($.inArray(key, errorList)!== -1) {
				if (JSONvalue[key]) {
					stbErr[key] = JSONvalue[key];
				}
			}
		}
		//sum errors
		for (var k in stbErr) {
			if (stbErr[k]) {
				err = err + parseInt(stbErr[k]);
			}
		}
		
		if (data[index]['mac']) {
			macIII = data[index]['mac'];
		}
		var tstamp = parseInt(data[index]['stime']) + '_' + macIII;
		//var lstamp = data[index]['ltime'];
		mcast = data[index]['url'];
		upt = parseInt(data[index]['upt']);
		ip = data[index]['ip'];
		fw = data[index]['fw'];
		if (tstamp && document.getElementById(tstamp)) {
			if (rtsperr) {
				document.getElementById(tstamp).title = rtsperr;
				document.getElementById(tstamp).style.backgroundColor = "red";
			} else if (upt >= lasttime ) {
				if (missingMcast) {
					document.getElementById(tstamp).title = 'no multicast';
					document.getElementById(tstamp).style.backgroundColor = "red";
				} else if (mcast) {
					document.getElementById(tstamp).title = mcast +'_ip:'+ ip;
					if (err == lastErr) {
						showErr = 0;
					} else {
						showErr = err - lastErr;
					}
					if (showErr < 1) {
						document.getElementById(tstamp).style.backgroundColor = "#39B239"; //green
						document.getElementById(tstamp).title = '';
					} else if (showErr < 8) {
						document.getElementById(tstamp).style.backgroundColor = "yellow";
					} else if (showErr > 7) {
						document.getElementById(tstamp).style.backgroundColor = "red";
					} else {
						document.getElementById(tstamp).style.backgroundColor = "orange";
						document.getElementById(tstamp).title = 'unknown'+ ' uptime ' + upt;
					}
					lastErr = err;
				} else {
					document.getElementById(tstamp).style.backgroundColor = "gray";
					document.getElementById(tstamp).title = 'no video'+ ' uptime ' + upt;
				}
			} else if (upt) {
					document.getElementById(tstamp).title = 'reboot';
					document.getElementById(tstamp).style.backgroundColor = "#00F";
			} else if (missingMcast) {
					document.getElementById(tstamp).title = 'no multicast';
					document.getElementById(tstamp).style.backgroundColor = "red";
			} else if (invaliddata) {
					document.getElementById(tstamp).title = 'invalid data';
					document.getElementById(tstamp).style.backgroundColor = "red";
			}
			if (upt && upt > 0) {
				lasttime = upt;
			}
		}
	});
}