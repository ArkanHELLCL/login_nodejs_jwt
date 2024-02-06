// definición de la función
$.fn.exporttocsv = function(options,callback){
	var opts = $.extend({}, $.fn.exporttocsv.defaults, options), largo=0; 	
	var csv = [];
	var rows = $(this).find('tr');
	// para cada componente que puede contener el objeto jQuery que invoca a esta función
	//this.each(function(){});
	if(opts.table=="ndt"){
		for (var i = 0; i < rows.length; i++) {
			var row = [], cols = $(rows[i]).find('td, th');

			for (var j = 0; j < cols.length; j++) 
				if($(cols[j]).children("span").length>0){
					row.push($(cols[j]).children("span")[0].innerText.replace(/(\r\n|\n|\r)/gm, ""));
				}else{
					row.push(cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ""));
				}            

			csv.push(row.join(options.separator));        
		}
	}
	if(opts.table=="dt"){	//DataTable
		var row = [];
		$(this).DataTable().columns().header().each(function(e,i){			
			row.push(e.innerText.replace(/(\r\n|\n|\r)/gm, ""))
		});
		var largo = row.length;
		csv.push(row.join(options.separator));  		
		var n;
		$(this).DataTable().data().reverse().each(function(e,i){			
			row = [];
			for (var j = 0; j < largo; j++){ 
				n=this[i][j].indexOf("</span>")
				if(n>=0){
					//console.log($(this[i][j]).text());
					row.push($(this[i][j]).text().replace(/(\r\n|\n|\r)/gm, ""))
				}else{
					//console.log(this[i][j]);
					row.push(this[i][j].replace(/(\r\n|\n|\r)/gm, ""))
				}												
			};
			csv.push(row.join(options.separator));  
		});
	}
    // Download CSV file
    downloadCSV(csv.join("\n"), options.fileName);
	if (typeof callback == 'function') { // make sure the callback is a function
		callback.call(csv.join("\n")); // brings the scope to the callback
	}

	function downloadCSV(csv, filename) {
		var csvFile;
		var downloadLink;

		// CSV file
		csvFile = new Blob(["\uFEFF"+csv], {type: "text/csv"});

		// Download link
		downloadLink = document.createElement("a");

		// File name
		downloadLink.download = filename;

		// Create a link to the file
		downloadLink.href = window.URL.createObjectURL(csvFile);

		// Hide download link
		downloadLink.style.display = "none";

		// Add the link to DOM
		document.body.appendChild(downloadLink);

		// Click download link
		downloadLink.click();
	}
};
// definimos los parámetros junto con los valores por defecto de la función
$.fn.exporttocsv.defaults = {
    // para el fondo un color por defecto
    fileName	: 'export.csv',
	separator	: ',',
	table		: 'ndt'
};

$.makeTable = function (mydata) {
    var table = $('<table border=1>');
    //var tblHeader = "<tr>";
    //for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";	
    //tblHeader += "</tr>";
    //$(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        $.each(value, function (key, val) {
            TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
};