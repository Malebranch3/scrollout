var scrollTimer = null;

window.sConfig.protecteds = {protecteds:'protecteds',dontBogMeBro:'dontBogMeBro',cleanEnd:'cleanEnd'};

window.sConfig.cleanEnd = function(name){
	window.removeEventListener('scroll', window.sConfig[name].eListener);
}

window.sConfig.dontBogMeBro = function(cb,ms){ //improve scroll preformance via timer
	if(scrollTimer){
		clearTimeout(scrollTimer);
	}
	console.log('activating');
	scrollTimer = setTimeout(function(){cb();scrollTimer = null;},ms);
}

for(var thing in window.sConfig){
	if(!(thing in window.sConfig.protecteds)){
		var propname = thing; //Store propertyname for later
		var el = window.sConfig[propname]; //Rename for ease of use
		var x = document.querySelector(el.selector);
		var xrect = x.getBoundingClientRect();
		el.fromTop = xrect.top + window.scrollY;
		el.fromBottom = xrect.bottom + window.scrollY;
		switch(el.mode){
			case 'hitpoint':
					el.ogFunc = function(){
						console.log("listening! "+(el.fromTop + el.padding.enter));
						if(window.pageYOffset >= (el.fromTop + el.padding.enter)){
							el.cb_action();
						}else{
							el.cb_reverse_action();
						}
					}
					el.eListener = function(){window.sConfig.dontBogMeBro(el.ogFunc,el.scrollDelay)};
					window.addEventListener('scroll', el.eListener);
				break;
			case 'enter':
					el.ogFunc = function(){
						console.log("listening! "+(el.fromTop + el.padding.enter));
						if(window.pageYOffset >= (el.fromTop + el.padding.enter - window.innerHeight)){
							el.cb_action();
							window.sConfig.cleanEnd(propname); //Trigger callback only once
						}
					}
					el.eListener = function(){window.sConfig.dontBogMeBro(el.ogFunc,el.scrollDelay)};
					window.addEventListener('scroll', el.eListener);
				break;
			case 'onfullview':
					el.ogFunc = function(){
						if(window.pageYOffset >= (el.fromBottom + el.padding.onfullview - window.innerHeight)){
							el.cb_action();
							window.sConfig.cleanEnd(propname); //Trigger callback only once
						}
					}
					el.eListener = function(){window.sConfig.dontBogMeBro(el.ogFunc,el.scrollDelay)};		
					window.addEventListener('scroll', el.eListener);
				break;
			case 'inview':
					el.ogFunc = function(){
						if(window.pageYOffset >= (el.fromTop - window.innerHeight) && window.pageYOffset <= (el.fromBottom + window.innerHeight)){
							el.cb_action();
							//Trigger callback as long as condition is met
						}
						console.log(window.pageYOffset);
						console.log(el.fromTop - window.innerHeight);
						console.log(el.fromBottom + window.innerHeight);
						
					}
					el.eListener = function(){window.sConfig.dontBogMeBro(el.ogFunc,el.scrollDelay)};			
					window.addEventListener('scroll', el.eListener);
		}
	}
}
