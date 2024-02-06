function ajax_icon_handling(type,title,text,htmlext) {
	switch (type) {
		case 'load':
			swal.fire({
				title: title,
				html: '<div class="save_loading"><svg viewBox="0 0 140 140" width="140" height="140"><g class="outline"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="rgba(0,0,0,0.1)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="circle"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="#71BBFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="200" stroke-dasharray="300"></path></g></svg></div><div></div>',
				showConfirmButton: false,
				allowOutsideClick: false,
				allowEscapeKey: false,
				text:text
			});
			break;
		case false:			
			setTimeout(function(){							
				swal.update({
					title:title,
					text:text,
					showConfirmButton: true,
					allowOutsideClick: true,
					allowEscapeKey: true,
					html:'<div class="sa"><div class="sa-error"><div class="sa-error-x"><div class="sa-error-left"></div><div class="sa-error-right"></div></div><div class="sa-error-placeholder"></div><div class="sa-error-fix"></div></div></div><div></div>'
				});										
				
			}, 1000);
			//$('.swal-close').on('click', function() { swal.closeModal(); });
				
			break;
		case true:
			//setTimeout(function(){
				swal.update({
					timer: 1500,
					html:'<div class="sa"><div class="sa-success"><div class="sa-success-tip"></div><div class="sa-success-long"></div><div class="sa-success-placeholder"></div><div class="sa-success-fix"></div></div></div><div></div>'+htmlext,
					title:title,
					text:text,
					showConfirmButton: true,
					allowOutsideClick: true,
					allowEscapeKey: true,					
				});				
			break;
	}
}