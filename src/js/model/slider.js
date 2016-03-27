var slider = function(options){
    this.trigger = options ? options.trigger : '#slider',
        this.sliderVal = options ? options.sliderVal : '.slider-val',
        this.sliderBtn = options ? options.sliderBtn : '.slider-btn',
        this.min = $(this.trigger).attr('min'),
        this.max = $(this.trigger).attr('max'),
        this.init();
};
slider.prototype = {
    init: function(){
        var f = this,
            slider = $(f.trigger);
        $(f.trigger).on('touchmove', function(){
            var sValue = slider.val();
            f.initPosition(sValue);
        });
        $(f.trigger).on('touchend', function(e){
            var sValue = slider.val();
            f.initPosition(sValue);
        });
        f.initPosition(slider.val());
    },
    left: function(sValue,sWidth, btnWidth){
        var f = this;
        return (sValue-f.min)/(f.max-f.min)*(sWidth-btnWidth)+$(f.trigger).offset().left;
    },
    initPosition: function(sValue){
        var f = this,
            slider = $(f.trigger),
            sWidth = slider.width(),
            btnWidth = $(f.sliderBtn).width();
        $(f.sliderVal).css({
            'left': f.left(sValue,sWidth, btnWidth) + 'px',
            'width': btnWidth
        }).text(sValue + '倍');
    }
};
export { slider }