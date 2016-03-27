/*
 * message
 * @params string 
 * type
 *
 */

function Message(opts){
 	var opts = opts || {};
 	var div = document.createElement('div');
	div.classList.add('m-message-center');
	if (!opts.type) {
		opts.type = 'error';
	}
	var span = document.createElement('span');
	span.innerHTML = opts.text;
	span.classList.add('m-message-'+opts.type);
	div.appendChild(span);
	document.body.appendChild(div);
	setTimeout(function(){
		span.style.opacity = 0;
	},2000)
	setTimeout(function(){
	    if (div != null){
	    	div.parentNode.removeChild(div);
	    }
	},2500);
}

window['Message'] = Message; 

window['Zepto']['message'] = function(opts) {
	Message(opts);
};

export { Message }