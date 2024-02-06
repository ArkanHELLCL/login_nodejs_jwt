// definición de la función
$.fn.tabsmaterialize = function(options,callback){
	// puede recibir un array de parámetros nombrados
	// invocamos a una función genérica que hace el merge 
	// entre los recibidos y los de por defecto 
	var opts = $.extend({}, $.fn.tabsmaterialize.defaults, options), largo=0;
	$(".yellow-bar").css("left","0px");
		
	
	$(".container-nav .tab-content p, .container-nav .tab-content ol, .container-nav .tab-content ol li").css("color",opts.color);	
	$(".yellow-bar").css("background-color",opts.active);	
	
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		// dark mode				
	}else{
	
	}
					
	// para cada componente que puede contener el objeto jQuery que invoca a esta función
	this.each(function(){
		// asignamos a la asignación del foco la invocación a una función
		var $active, $content, $links = $(this).find('a'), $bar, width;

		$active = $($links[0]);
		$active.addClass('active');

		$content = $($active[0].hash);

		$links.not($active).each(function() {
			$(this.hash).hide();
		});
		//$bar = $(".yellow-bar");
		$bar =  $active.siblings("span.yellow-bar");
		width=$active.innerWidth();
		if(width==0){
			var copied_elem = $active.clone()
                      .attr("id", false)
                      .css({"visibility":"hidden", 
					  		"display":"block", 
                            "position":"absolute",
							"padding-left": $active.css("padding-left"),
							"padding-right": $active.css("padding-right")});
			$("body").append(copied_elem);
			//var scroller_height = copied_elem.height();
			width = copied_elem.innerWidth();
			copied_elem.remove();
		}
		
		
		$bar.width(width);
		$links.each(function(){
			largo=largo+$(this).innerWidth();
		});						
		
		if (typeof callback == 'function') { // make sure the callback is a function
			callback.call($links[0].hash); // brings the scope to the callback
		}
		
		
		$(".content-nav span.yellow-bar").resize(function(){
			var $active = $(".content-nav span.yellow-bar");
			var width= $active.innerWidth();
			var $bar = $active.siblings("span.yellow-bar");
			$bar.width(width);
		});
		
		$(this).on('click', 'a', function(e) {			
			$active.removeClass('active');
			$active.find("span.badge.green").remove();
			$(".breadcrumb").find("span.badge.green").remove();
			/*$active.find("span.badge.red").remove();
			$(".breadcrumb").find("span.badge.red").remove();*/
			$content.hide();

			var posY = 0;			
			$(".tabas-toast").each(function(){
				$(this).css("display","none");
				var largoInfo=$(this).innerWidth();										
				$(this).css("right","-"+(largoInfo)+"px");										
			});				

			$active = $(this);
			$content = $(this.hash);

			$bar.animate({
				width: $(this).innerWidth() + 'px',
				left: $(this).position().left + 'px'
			});

			$active.addClass('active');			
			
			if (opts.contentAnimation){
				$content.show("slow",function(){
					var $link=$content.children(".tabs-toast");
					var duration = 0;				
					posY = 20;				
					$link.each(function(){
						var largoInfo=$(this).innerWidth();
						var $element = $(this);
						$element.css("right","-"+(largoInfo)+"px");
						$element.css("top",posY+"px");
						$element.css("display","block");
						$element.delay(duration).animate({
							display:"block",
							right:"0px"
						},function(){
							$('[data-toggle="tooltip"]').tooltip();
							//var $link=$content.children(".tabs-toast");

							$element.children("a").click(function(){
								var $_active=$($(this).data("active"));
								var $_content=$($active[0].hash);
								//console.log($active);
								$_active.removeClass('active');
								$_content.hide();

								$_active=$(this.hash);
								$_content=$($_active[0].hash);
								$_active.addClass('active');
								$_content.show("slow");
								$(".yellow-bar").animate({
									width: $_active.innerWidth() + 'px',
									left: $_active.position().left + 'px'
								});


								$active=$_active;
								$content=$_content;
							});
						});
						posY = posY + 50;
						duration = duration + 400;
					});							

					if (typeof callback == 'function') { // make sure the callback is a function
						callback.call($active[0].hash); // brings the scope to the callback
					}

				});
			}else{
				$content.show();
					var $link=$content.children(".tabs-toast");
					var duration = 0;				
					posY = 20;				
					$link.each(function(){
						var largoInfo=$(this).innerWidth();
						var $element = $(this);
						$element.css("right","-"+(largoInfo)+"px");
						$element.css("top",posY+"px");
						$element.css("display","block");
						$element.delay(duration).animate({
							display:"block",
							right:"0px"
						},function(){
							$('[data-toggle="tooltip"]').tooltip();
							//var $link=$content.children(".tabs-toast");

							$element.children("a").click(function(){
								var $_active=$($(this).data("active"));
								var $_content=$($active[0].hash);
								//console.log($active);
								$_active.removeClass('active');
								$_content.hide();

								$_active=$(this.hash);
								$_content=$($_active[0].hash);
								$_active.addClass('active');
								$_content.show("slow");
								$(".yellow-bar").animate({
									width: $_active.innerWidth() + 'px',
									left: $_active.position().left + 'px'
								});


								$active=$_active;
								$content=$_content;
							});
						});
						posY = posY + 50;
						duration = duration + 400;
					});							

					if (typeof callback == 'function') { // make sure the callback is a function
						callback.call($active[0].hash); // brings the scope to the callback
					}

				
			}

			e.preventDefault();
		});
		
		
		$(this).on('click','.tab-toggler',function(){
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			$('.animated-icon1').toggleClass('open');
			$(".movil").toggleClass('open');
		});
	});
	
	if (opts.menumovil){		
		if(this.width()<=(largo+80)){		
			this.children(".tab-toggler").css("display","block");
			this.addClass("movil");
			$(".yellow-bar").hide();
			$(".close").hide();
			this.children(".tab-toggler").prepend("<a href=''></a>");
			//this.children("a")[0].before('<a href=""></a>');		
		}else{
			this.children(".tab-toggler").css("display","none");
			this.removeClass("movil");
			$(".yellow-bar").show();
			$(".close").show();				
		}
		
		$( window ).resize(function() {
			if($(".content-nav").width()<=(largo+80)){
				$(".content-nav").children(".tab-toggler").css("display","block");
				$(".content-nav").addClass("movil");
				$(".yellow-bar").hide();
				$(".close").hide();								
			}else{
				$(".content-nav").children(".tab-toggler").css("display","none");
				$(".content-nav").removeClass("movil");
				$(".yellow-bar").show();
				$(".close").show();			
			}
		});		
	}
	/*$(this).parent().parent().css("visibility","visible");*/
};

// definimos los parámetros junto con los valores por defecto de la función
$.fn.tabsmaterialize.defaults = {
    // para el fondo un color por defecto    
	active: '#458CFF',	
	menumovil: true,
	contentAnimationSpeed:"slow",
	contentAnimation:"true"
};