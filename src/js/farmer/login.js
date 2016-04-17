/**
 * Created by lio on 16/4/9.
 */
function Login(ajaxObj){
    var farmerLogin = document.getElementById('farmer-login'),
        submitBtn = farmerLogin.querySelector('button'),
        userName = farmerLogin.querySelector("input[name='userName']"),
        password = farmerLogin.querySelector("input[name='password']");
    userName.addEventListener('input',function(){LoginCheck(this.value);},false);
    password.addEventListener('input',function(){LoginCheck(this.value);},false);
    submitBtn.addEventListener('click',function(){
        if(userName.value && password.value){
            brd_ajax($.extend({},ajaxObj,{
                'data':{
                    'username':userName.value,
                    'password':password.value
                }
            }));
        }
    },false);
    function LoginCheck(input){
        var reg=/[]/;
        if(input){
            if(userName.value && password.value){
                submitBtn.disabled = false;
                submitBtn.classList.remove('disabled');
            }else {
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
            }
            return true;
        }else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
            $.message({
                'text':'Error'
            });
        }
    }
}
function Register(ajaxObj){
    var farmerLogin = document.getElementById('farmer-login'),
        submitBtn = farmerLogin.querySelector('button'),
        userName = farmerLogin.querySelector("input[name='userName']"),
        password = farmerLogin.querySelector("input[name='password']"),
        passwordAgain = farmerLogin.querySelector("input[name='passwordAgain']");
    userName.addEventListener('input',function(){LoginCheck(this.value);},false);
    password.addEventListener('input',function(){LoginCheck(this.value);},false);
    passwordAgain.addEventListener('input',function(){LoginCheck(this.value);},false);
    submitBtn.addEventListener('click',function(){
        if(userName.value && password.value){
            if(password.value == passwordAgain.value){
                brd_ajax($.extend({},ajaxObj,{
                    'data':{
                        'username':userName.value,
                        'password':password.value,
                        'passwordAgain':passwordAgain.value,
                    }
                }));
            }else {
                $.message({
                    'text':'两次密码不同'
                });
            }
        }
    },false);
    function LoginCheck(input){
        var reg=/[]/;
        if(input){
            if(userName.value && password.value && passwordAgain.value){
                submitBtn.disabled = false;
                submitBtn.classList.remove('disabled');
            }else {
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
            }
            return true;
        }else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
            $.message({
                'text':'Error'
            });
        }
    }
}
//Login();
window['Login'] = Login;
window['Register'] = Register;
//export { Login }