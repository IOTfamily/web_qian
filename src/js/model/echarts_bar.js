// 柱状图
function project_bar(opts){
	let obj = document.querySelector(opts.id);
	if(!obj) return;
	let items = obj.querySelectorAll(opts.item),
		spans = obj.querySelectorAll(opts.item + ' span'),
		rate = opts.rate,
		data = opts.data || [1000,750,100];
	function change(num){
		var max = num*rate[0]*1.1;
		if(max==0) max=1;
		data.map((item,index)=> {
			item = num*rate[index];
			spans[index].innerHTML = Number.parseFloat(item).toFixed(2) + '元';
			items[index].style.cssText += ';height:'+ (item/max)*100 + '%';
		});
	}
	return {
		change : change
	}
}

export { project_bar }