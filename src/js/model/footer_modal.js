function Footermodal(options){
    var opts = $.extend({
        trigger: '#show-footer',
        modalName: '.footer-modal',
        item: '',
        className: 'active'
    }, options);

    $(opts.trigger).on('click', function(){
        $(opts.modalName).addClass(opts.className);
        $('body').css("overflow", "hidden");
    });
    $('.footer-modal').on('click', function(){
        $(opts.modalName).removeClass(opts.className);
        $('body').css("overflow", "auto");
    });
    $(opts.item).on('click', function(e){
        e.stopPropagation();
    })
};
window['Footermodal'] = Footermodal;

window['Zepto']['Footermodal'] = function(options) {
    Footermodal(options);
};

export { Footermodal }