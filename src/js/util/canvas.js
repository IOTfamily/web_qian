/**
 * Created by lio on 16/4/17.
 */
//扇形
function startCanvas(){
    function protoInit(){
        CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
            // 初始保存
            this.save();
            // 位移到目标点
            this.translate(x, y);
            this.beginPath();
            // 画出圆弧
            this.arc(0,0,radius,sDeg, eDeg);
            // 再次保存以备旋转
            this.save();
            // 旋转至起始角度
            this.rotate(eDeg);
            // 移动到终点，准备连接终点与圆心
            this.moveTo(radius,0);
            // 连接到圆心
            this.lineTo(0,0);
            // 还原
            this.restore();
            // 旋转至起点角度
            this.rotate(sDeg);
            // 从圆心连接到起点
            this.lineTo(radius,0);
            this.closePath();
            // 还原到最初保存的状态
            this.restore();
            return this;
        };
    }
    function drawPan(ctx){
        var deg = Math.PI/180;
        ctx.sector(150,150,150,0*deg,30*deg).fill();
        ctx.fillStyle="#f00";
        ctx.sector(150,150,150,30*deg,60*deg).fill();
        ctx.fillStyle="#0f0";
        ctx.sector(150,150,150,90*deg,120*deg).fill();
        ctx.fillStyle="#00f";
        ctx.sector(150,150,150,120*deg,150*deg).fill();
        ctx.fillStyle="#789";
        ctx.sector(150,150,150,150*deg,180*deg).fill();
        ctx.fillStyle="#abcdef";
        ctx.sector(150,150,150,180*deg,210*deg).fill();
        ctx.sector(150,150,150,210*deg,240*deg).fill();
        ctx.fillStyle="#f00";
        ctx.sector(150,150,150,240*deg,270*deg).fill();
        ctx.fillStyle="#0f0";
        ctx.sector(150,150,150,300*deg,330*deg).fill();
        ctx.fillStyle="#00f";
        ctx.sector(150,150,150,330*deg,360*deg).fill();
        ctx.fillStyle="#789";

        function arc(x,y,rad,color){
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(x,y,rad,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.fontWeight='500';//文字粗细
            ctx.font='20px Arial';//文字字体;
            ctx.font="20px";//文字大小
            ctx.fillText("我爱三妹",150,150);
            ctx.fill();
            ctx.closePath();
        };
        //画按钮
        arc(150,150,50,'#000');
    }

    function test(ctx){
        //画布尺寸
        ctx.width=800;
        ctx.height=800;

        //画笔样式
        ctx.lineWidth=4;
        ctx.strokeStyle="blue";
        //填充样式
        ctx.fillStyle='pink';

        //绘画路径
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(100,100);
        //填充路径
        ctx.fillRect(0,0,400,800);

        ctx.stroke();
        ctx.fill();
    }
    return{
        'protoInit':protoInit,
        'drawPan':drawPan,
        'test':test
    }
}

export { startCanvas };