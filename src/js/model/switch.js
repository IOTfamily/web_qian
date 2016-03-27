/*
 * switch
 * @params string 
 * @params obj
 * @callback
 * type
 *
 */

function SwitchTool(opts) {
	// 初始化组件
	this.event = (function (argument) {
		var input = opts.node.querySelector('input');
		input.value = 1;
		var switchTool = opts.node;
		var label = opts.node.querySelector('label');
		var p = opts.node.querySelector('p');
		opts.node.addEventListener('click',function(){
			if(!p.getAttribute('class')){
				p.setAttribute('class','switchmove');
				input.value = '2';
				if(opts.right){
					opts.right(input.value);
				}
			}else{
				p.removeAttribute('class','switchmove');
				input.value = '1';
				if(opts.left){
					opts.left(input.value);
				}
			}
		});
	}())

};
window['SwitchTool'] = SwitchTool;
window['Zepto']['SwitchTool'] = function(opts) {
	new SwitchTool(opts);
};
export { SwitchTool }