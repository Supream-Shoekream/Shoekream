/**
 * Strp1: 가격/입찰기한 설정
 * price_box: 잘못된 가격을 입력했을 때 has_warning, has_danger 클래스 추가
 * errormsg: 그때 에러메세지 display설정
 * bid_input: 구매입찰시 가격 입력하는 input
 * price_now: 서버에서 받아온 즉시 구매가
 */
const price_box = document.querySelector('.instant_group .price_now');
const errormsg = document.querySelector('.price_warning')
const bid_input =document.querySelector('#bid_input')
let price_now;
/**
 *서버에 보낼 데이터 선언
 * isNow
 * price = 구매희망가
 * period
 * usePoint
 * cardInfo
 * receiver
 * receiverHp
 * receiverAddress
 * deliveryMemo
 */
let is_now = true;
let wish_price = 0;
let period = 0;
let use_point = 0;
let card_info= '';
let delivery_memo ='';
let fees = 0;    //수수료
/**
 *  🤍 기능1 입찰 <-> 즉시
 *  .title_txt : 내용 "구매 입찰하기"<->"즉시 구매하기"
 *  .tab_area.buy_tab .item : class on 추가/제거
 *  .price_now : class active_input 추가/제거
 *  .price_now_title : 내용 "구매 희망가"<->"즉시 구매가"
 *  .deadline_info_area : class style="display=block or none"
 *  .btn_confirm > a : 내용 "구매 입찰 계속" <->  "즉시 구매 계속"
 *  구매입찰누르면 가격 초기화 <-> 가격반영(즉시구매누르면 자동으로 값이 입력되도록!)
 */
function buy_now() {    //즉시 구매 버튼 클릭
    $(".header_main .title_txt").html("즉시 구매하기");
    $("#bid").removeClass("on");
    $("#now").addClass("on");
    $(".price_now").removeClass("active_input");
    $("#bid_input").hide();
    $("#now_price").show();
    $(".price_now_title").html("즉시 구매가");
    $(".deadline_info_area").hide();
    $(".step-1 .btn_confirm a").html("즉시 구매 계속");
    $(".step-1 .btn_confirm a").removeClass("disabled")
    $(".is_dark span").html("즉시 구매가")
    // 만약 에러메세지가 있을 때 없애기 위해
    price_box.classList.remove('has_warning')
    price_box.classList.remove('has_danger')
    errormsg.style.display="none"
    is_now=true;
    period = 0;
}

function buy_bid() {  // 구매 입찰 버튼 클릭
    $(".header_main .title_txt").html("구매 입찰하기");
    $("#now").removeClass("on");
    $("#bid").addClass("on");
    $(".price_now").addClass("active_input");
    $("#bid_input").show();
    $("#now_price").hide();
    $(".price_now_title").html("구매 희망가");
    $(".deadline_info_area").show();
    $(".step-1 .btn_confirm a").html("구매 입찰 계속");
    $(".step-1 .btn_confirm a").addClass("disabled")
    $(".is_dark span").html("구매 희망가")
    document.getElementById("bid_input").value=''; // bid_input value 값 초기화
    is_now=false;
}
/**
 * 🤍 기능2 즉시구매가가 없을 경우 : 구매입찰을 기본으로 설정하고, 즉시구매를 못누르도록 한다.
 */
if(document.querySelector('#now_price').innerHTML.trim() == '-'){
    buy_bid();
    const now = document.getElementById('now');
    now.innerHTML =`<a onclick="#" class="item_link">즉시 구매</a>`
    price_now = 999999999999;   //즉시구매가로 넘어갈 수 없도록 설정
}else{
    price_now =  Number(document.querySelector('#now_price').innerHTML.replaceAll(',',''));
}


/**
 * 🤍 기능3: 입찰 선택시 input에 주는 이벤트 추가
 * input( value 속성의 값이 바뀔 때마다 발생하는 이벤트) -> 입찰 선택시 가격에 따라 경고
 * keyup( value가 업데이트 된 이후에 키보드에서 손을 떼면 발생하는 이벤트 ) -> 1000단위 콤마
 * blur(요소의 포커스가 해제되었을 때 발생하는 이벤트) -> 1000원단위, 입찰버튼 황성화
 */
bid_input.addEventListener('input', e=>{
    let str_price=e.target.value;
    // 숫자 외 입력 불가 (숫자도 10글자까지)
    if (str_price.length > e.target.maxLength){
        e.target.value = str_price.slice(0, e.target.maxLength);
    }
    // .price_now에 has_danger has_warning추가
    if(str_price < 30000 ){
        price_box.classList.add('has_warning')
        price_box.classList.add('has_danger')
        errormsg.style.display="block"
    } else {
        price_box.classList.remove('has_warning')
        price_box.classList.remove('has_danger')
        errormsg.style.display="none"
    }
});
// 1000단위 콤마
bid_input.addEventListener('keyup', function(e) {
    let str_price = e.target.value;
    str_price = Number(str_price.replaceAll(',', ''));
    if(isNaN(str_price)) {
        bid_input.value = '';
    }else {
        const form_price = str_price.toLocaleString('ko-KR');
        bid_input.value = form_price;
    }
})
bid_input.addEventListener('blur', e=>{
    let str_price=e.target.value;
    str_price =  Number(str_price.replaceAll(',', ''));
    // 30000원 미만 입력시 내용이 지워진다.
    if(str_price < 30000 ){
        e.target.value='';
    }
    // 즉시 구매값보다 비싸게 부르면 즉시구매로 넘어간다.
    if(price_now < str_price){
        buy_now()
    }
    //1000원 단위로만 입력 가능하다.
    if(str_price!=0 && str_price%1000!=0){
        const form_price = str_price.toLocaleString('ko-KR');
        bid_input.value = form_price.slice(0,form_price.length-3)+"000"
    }
    //구매입찰계속 버튼 활성화 조건
    if((str_price >= 30000)  &&(price_now > str_price) ){
        $(".step-1 .btn_confirm a").removeClass("disabled")
    }else{
        $(".step-1 .btn_confirm a").addClass("disabled")
    }
})


/**
 * 🤍 기능4: 마감기한 버튼 클릭시 날짜 계산해서 출력
 */
$(document).on('click', '.deadline_tab a', function(){
    if($(".deadline_tab a").has('.is_active')){
        // is_active 클래스가 존재하면 length 값은 1이상이 됨. -> true
        $(".deadline_tab a").removeClass("is_active");
    }
    this.className+=" is_active";
    //🌈날짜 계산 후 반영 필요
    const today = new Date();
    let deadline = new Date(today);
    let periodtxt =this.innerHTML.replace('일','').trim();
    periodtxt = Number(periodtxt) //숫자로 변환하지 않으면 잘못 계산함
    period = periodtxt; //서버에 보낼 데이터와 연결
    deadline.setDate(today.getDate()+periodtxt);
    let dmonth =deadline.getMonth()+1
    let deadline_txt = periodtxt + "일 ("+deadline.getFullYear()+"/"+dmonth+"/"+deadline.getDate()+" 마감)"
    document.querySelector('.deadline_txt').innerHTML= deadline_txt
});
// 구매 입찰하기 입찰 마감기한 클릭시 버튼 활성화
/**
 * 🤍 기능5 : step2로 넘어가기전에 즉시구매가 or 구매희망가 선택된 것을 가져온다. + 입찰마감기한 저장
 * wish_price: 구매희망가
 * fees: 수수료 = (가격*0.015 /100 )* 100 = 1.5% 100의자리수
 * 총 결재금액 = 즉시구매가(구매희망가) + 수수료 + 배송비 - 사용포인트(0)
 */
function step2(){
    document.querySelector('.step-1').style.display="none"
    document.querySelector('.step-2').style.display="block"
    // step2로 넘어가기전에 즉시구매가 or 구매희망가 선택된 것을 가져온다.
    // console.log(document.querySelector('#now.on'))
    if(document.querySelector('#now.on')!=null){
        wish_price =  price_now;
        period = 0;
        console.log("즉시구매가"+price_now)
        document.querySelector('.product_price').innerHTML = wish_price.toLocaleString('ko-KR') + "원"
    }else{
        if(Number(period) == 0) { period=30; }  // 설정 클릭 안하면 30일로 세팅!
        console.log(period);
        wish_price = Number(bid_input.value.replaceAll(',', ''));
        console.log("wish_price:"+wish_price)
        document.querySelector('.product_price').innerHTML = bid_input.value+"원"
    }
    fees = Math.floor(wish_price*0.015/100)*100
    document.querySelector('.fees').innerHTML = fees.toLocaleString('ko-KR') + "원"
    price_total=wish_price  +fees + 3000
    document.querySelector('.order_info .amount').innerHTML= price_total.toLocaleString('ko','KR')
    document.querySelector('.buy_total_confirm .price .amount').innerHTML = price_total.toLocaleString('ko','KR')
}



/**
 * 🤍 기능6 새 주소 추가
 * 열고닫기
 * 유효성검사
 * create를 위한 fetch
 * */
document.querySelector('.layer_delivery .btn_layer_close').addEventListener('click', close_new_delivery)
document.querySelector('.layer_delivery .btn_delete').addEventListener('click', close_new_delivery)
function close_new_delivery(){
    document.querySelector('.layer_delivery').style.display="none"
}
function pop_new_delivery(){
    document.querySelector('.layer_delivery').style.display="block"
}

function maxLengthCheck(object){
    if (object.value.length > object.maxLength){
        object.value = object.value.slice(0, object.maxLength);
    }
}

// 디바운스
let timer=false;//최초 false
const debounce=(e, callback)=> {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        callback('' + e.target.value);
    }, 100); //200ms 이후 반응(디바운스)
}

// 이름 정규 표현식
function validateName(strName){
    // const reg_name =  /^[가-힣a-zA-Z]+$/;
    const reg_name = /^[가-힣]{2,6}$/;
    if(!reg_name.test(''+strName)){
        return false;
    }
    return true;
}

// 휴대폰 번호 정규 표현식
function validateHp(strHp){
    const reg_hp = /^01(?:0|1|6|7|8|9)(?:\d{3}|\d{4})\d{4}$/;
    if(!reg_hp.test(''+strHp)){
        return false;
    }
    return true;
}

// 이름 유효성 검사
document.querySelector('#name_input').addEventListener('input', e=>{
    let strName=e.target.value;
    let errorMsg='';
    if(!validateName(strName)){
        errorMsg='올바른 이름을 입력해주세요. (2 - 50자)';
        document.querySelector('#name_input_box').className='has_button input_box has_error';
        document.querySelector('#name_input').setAttribute('validateresult',false);
    } else {
        document.querySelector('#name_input_box').className='has_button input_box fill';
        document.querySelector('#name_input').setAttribute('validateresult',true);
    }
    document.querySelector('#name_input_error').innerHTML=errorMsg;
});

// 휴대폰 번호 유효성 검사
document.querySelector('#hp_input').addEventListener('input', e=>{
    debounce(e, strHp=>{
        let errorMsg='';
        if(!validateHp(strHp)){
            errorMsg='휴대폰 번호를 정확히 입력해주세요.';
            document.querySelector('#hp_input_box').className='input_box has_error';
            document.querySelector('#hp_input').setAttribute('validateresult',false);
        } else {
            document.querySelector('#hp_input_box').className='input_box fill';
            document.querySelector('#hp_input').setAttribute('validateresult',true);
        }
        document.querySelector('#hp_input_error').innerHTML=errorMsg;
    })
});

let strName
let strHp
document.querySelectorAll('#name_input').forEach((item) =>{
    item.addEventListener('blur', e=>{
        strName=e.target.value;
        if((validateName(strName))&&(validateHp(strHp))){
            $("#submit_btn").removeClass("active");
            $("#submit_btn").removeClass("disabled")
        }else{
            $("#submit_btn").addClass("active");
            $("#submit_btn").addClass("disabled")
        }
    })
})

document.querySelectorAll('#hp_input').forEach((item) =>{
    item.addEventListener('blur', e=>{
        strHp=e.target.value;
        if((validateName(strName))&&(validateHp(strHp))){
            $("#submit_btn").removeClass("active");
            $("#submit_btn").removeClass("disabled")
        }else{
            $("#submit_btn").addClass("active");
            $("#submit_btn").addClass("disabled")
        }
    })
});


/**
 * 🤍 기능7 주소 변경
 * 열고 닫기
 * 사용자의 주소 리스트를 불러오는 fetch
 * 주소리스트 클릭시 내용 반영 및 닫기
 */
function close_address(){
    document.querySelector('.layer_address').style.display="none"
}
function pop_address(){
    document.querySelector('.layer_address').style.display="block"
}

// 주소 리스트중 하나 클릭시 레이어창 닫고 내용 반영
const address = document.querySelectorAll('.select');
address.forEach((item) => {
    item.addEventListener('click', () => {
        address.forEach((e) => {
            // console.log(e.childNodes[3].childNodes[0]);
            e.childNodes[3].style.display='none';
        })
        let edit_address=item.childNodes[1].childNodes[3].childNodes[5].childNodes[1].innerHTML
        // console.log(edit_address)
        item.childNodes[3].style.display='block';
        close_address();
        document.querySelector('.address_info .address_txt').innerHTML= edit_address
    })
})

/**
 * 🤍 기능8 배송 요청사항
 * 열고 닫기
 * 배송 요청 리스트 선택시 효과
 * 직접 입력 선택시 효과주기
 * 직접 입력 선택시 직접 입력에 키를 입력할 때 버튼 활성화
 * 직접 입력 선택시 직접 입력에 내용이 없다면 비활성화
 * 배송 요청사항 내용 반영하기
 */
function close_layer_shipping_memo(){
    document.querySelector('.layer_shipping_memo').style.display="none"
}
function pop_layer_shipping_memo(){
    document.querySelector('.layer_shipping_memo').style.display="block"
}

//배송 요청 리스트 선택시 효과
const selectable = document.querySelectorAll(".button_shipping_memo_wrap.selectable");
const direct_input=document.querySelector(".button_shipping_memo_wrap.direct_input");
const memo_apply_btn=document.querySelector(".shipping_memo_buttons .btn_apply");
selectable.forEach((item)=>{
    item.addEventListener('click',()=>{
        selectable.forEach((e)=>{
            e.classList.remove('checked');
            e.childNodes[2].style.display="none";
        })
        //직접입력부분도 효과 없애준다.
        direct_input.classList.remove('checked')
        document.querySelector(".direct_input img").style.display="none"
        document.querySelector(".textarea_shipping_memo").style.display="none"
        //클릭한 애만 효과준다.
        item.classList.add('checked');
        item.childNodes[2].style.display="block";
        //직접입력 갔다가 돌아왔을때 방지용
        memo_apply_btn.classList.remove('disabled')
    })
})

//직접 입력 선택시 효과주기
direct_input.addEventListener('click',(e)=>{
    document.querySelector(".textarea_shipping_memo").style.display="block"
    //위에 selectable 체크 그림 없애주기
    selectable.forEach((e)=>{
        e.classList.remove('checked');
        e.childNodes[2].style.display="none";
    })
    direct_input.classList.add('checked')
    document.querySelector(".direct_input img").style.display="block"
    // 적용하기 버튼 비활성화
    memo_apply_btn.classList.add('disabled')
})

//직접 입력 선택시 직접 입력에 키를 입력할 때 버튼 활성화
//직접 입력 선택시 직접 입력에 내용이 없다면 비활성화
let text = document.querySelector('.shipping_memo textarea')
text.addEventListener('input',()=>{
    if(text.value!=""){
        memo_apply_btn.classList.remove('disabled')
    }else{
        memo_apply_btn.classList.add('disabled')
    }
})

//배송 요청사항 내용 반영하기
function update_layer_shipping_memo(){
    let checkedtext =document.querySelector('.layer_shipping_memo .checked p').innerHTML
    const input = document.querySelector('.button_shipping_memo_wrap .placeholder')
    //직접입력할 땐 textarea의 값을 전달
    if(checkedtext=="직접 입력"){
        checkedtext = document.querySelector('.layer_shipping_memo textarea').value
        console.log(checkedtext)}
    input.innerHTML = checkedtext
    delivery_memo = checkedtext;
    document.querySelector('.layer_shipping_memo').style.display="none"
}


// 포인트 ? 열고 닫기
/**
 * 🤍 기능9 포인트
 * 포인트 ? 열고 닫기
 * 모두사용 클릭시 input에 value + 총결재금액이랑 결재정보에 반영
 * 내용입력 후 커서가 없어질때 조건 -> 총 결재금액 반영
 * 1000단위 콤마
 * use_point 반영
 */
function close_point(){
    document.querySelector('.layer_point').style.display="none"
}
function pop_point(){
    document.querySelector('.layer_point .point').innerHTML =
        document.querySelector('.info_point .point' ).innerHTML
    document.querySelector('.layer_point').style.display="block"
}

const point_input = document.querySelector('.input_credit')
const form_has_point = document.querySelector('.info_point .point').innerHTML
//가진 포인트
const has_point = Number(form_has_point.replaceAll(',', ''));
//적용 포인트
const form_apply_point = document.querySelector('.apply_point')
//총 결재금액
const span_price_total =document.querySelector('.price_total.order_info .amount')
let price_total


//모두사용 클릭시 input에 value + 총결재금액이랑 결재정보에 반영
document.querySelector('.btn_use_credit').addEventListener('click',(e)=>{
    point_input.value= form_has_point
    form_apply_point.innerHTML=form_has_point
    let apply_point = Number(form_has_point.replaceAll(',', ''));

    price_total = wish_price  +fees + 3000 - apply_point
    //총 결재금액 = 즉시구매가(구매희망가) + 수수료 + 배송비 - 사용포인트
    span_price_total.innerHTML = price_total.toLocaleString('ko-KR')
    use_point = apply_point;
})


// 내용입력 후 커서가 없어질때 조건
point_input.addEventListener('blur',()=>{
    let point = point_input.value
    //1000원 단위로만 입력 가능하다.
    if(point!='' && point%1000!=0){
        if(point/1000 <1){
            //000입력 방지
            point_input.value = 0;
        }else{
        const form_point = point.toLocaleString('ko-KR');
        point_input.value = form_point.slice(0,form_point.length-3)+"000"
        }
    }
    let apply_point =Number(point_input.value.replaceAll(',', ''));
    //총 결재금액 = 즉시구매가(구매희망가) + 수수료 + 배송비 - 사용포인트
    price_total = wish_price  + fees + 3000 - apply_point
    form_apply_point.innerHTML= apply_point.toLocaleString('ko-KR')
    span_price_total.innerHTML = price_total.toLocaleString('ko-KR')
    use_point = apply_point;
})

point_input.addEventListener('input', e=>{
    let point=e.target.value;
    // 숫자 외 입력 불가 (숫자도 10글자까지)
    if (point.length > e.target.maxLength){
        e.target.value = str_price.slice(0, e.target.maxLength);
    }
});
// 1000단위 콤마
point_input.addEventListener('keyup', function(e) {
    let str_point = e.target.value;
    str_point = Number(str_point.replaceAll(',', ''));

    if(isNaN(str_point)) {
        point_input.value = '';
    }else {
        const form_point = str_point.toLocaleString('ko-KR');
        point_input.value = form_point;
    }
    if(str_point > has_point){
        point_input.value = form_has_point
    }
})

/**
 * 🤍 기능10 새 카드 추가
 * 열고 닫기
 * 정규식
 * 등록시 fetch로 card 등록
 */
function close_card(){
    document.querySelector('.layer_card').style.display="none"
}
function pop_card(){
    document.querySelector('.layer_card').style.display="block"
}
// 카드 번호 정규 표현식
function validateCc1(strCc1){
    const reg_cc1 = /^[0-9]{4}$/;
    if(!reg_cc1.test(''+strCc1)){
        return false;
    }
    return true;
}
// 생년월일 정규 표현식
function validateBirthday(strBirthday){
    const reg_birthday = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
    if(!reg_birthday.test(''+strBirthday)){
        return false;
    }
    return true;
}
//비밀번호 정규 표현식
function validatePin(strPin){
    const reg_pin = /^[0-9]{2}$/;
    if(!reg_pin.test(''+strPin)){
        return false;
    }
    return true;
};
// 카드 번호 유효성 검사
document.querySelectorAll('#cc-1').forEach((item) =>{
    item.addEventListener('input', e=>{
        let strCc1=e.target.value;
        let errorMsg='';
        if(!validateCc1(strCc1) && (item.length != 4)){
            errorMsg='올바른 카드 번호를 입력해주세요.(16자)';
            document.querySelector('#card_input_box').className='input_box has_error';
            document.querySelector('#cc-1').setAttribute('validateresult',false);
        } else {
            document.querySelector('#card_input_box').className='input_box fill';
            document.querySelector('#cc-1').setAttribute('validateresult',true);
        }
        document.querySelector('#card_input_error').innerHTML=errorMsg;
    })});

// 생년월일 유효성 검사
document.querySelector('#birthday_input').addEventListener('input', e=>{
    let strBirthday=e.target.value;
    let errorMsg='';
    if(!validateBirthday(strBirthday)){
        errorMsg='정확한 생년월일 6자를 입력해주세요';
        document.querySelector('#birthday_input_box').className='input_box has_error';
        document.querySelector('#birthday_input').setAttribute('validateresult',false);
    } else {
        document.querySelector('#birthday_input_box').className='input_box fill';
        document.querySelector('#birthday_input').setAttribute('validateresult',true);
    }
    document.querySelector('#birthday_input_error').innerHTML=errorMsg;
});

// 비밀번호 유효성 검사
document.querySelector('#pin_input').addEventListener('input', e=>{
    let strPin=e.target.value;
    let errorMsg='';
    if(!validatePin(strPin)){
        errorMsg='비밀번호 앞자리 2자 입력해주세요';
        document.querySelector('#pin_input_box').className='has_button input_box has_error';
        document.querySelector('#pin_input').setAttribute('validateresult',false);
    } else {
        document.querySelector('#pin_input_box').className='has_button input_box fill';
        document.querySelector('#pin_input').setAttribute('validateresult',true);
    }
    document.querySelector('#pin_input_error').innerHTML=errorMsg;
});

// 버튼 활성화
let strCc1
let strBirthday
let strPin
document.querySelectorAll('.input_card').forEach((item) =>{
    item.addEventListener('blur', e=>{
        strCc1=e.target.value;
        if((validateCc1(strCc1))&&(validateBirthday(strBirthday))&&(validatePin(strPin))){
            $("#submit_btn").removeClass("active");
            $("#submit_btn").removeClass("disabled")
        }else{
            $("#submit_btn").addClass("active");
            $("#submit_btn").addClass("disabled")
        }
    })
})

document.querySelectorAll('#birthday_input').forEach((item) =>{
    item.addEventListener('blur', e=>{
        strBirthday=e.target.value;
        if((validateCc1(strCc1))&&(validateBirthday(strBirthday))&&(validatePin(strPin))){
            $("#submit_btn").removeClass("active");
            $("#submit_btn").removeClass("disabled")
        }else{
            $("#submit_btn").addClass("active");
            $("#submit_btn").addClass("disabled")
        }
    })
})

document.querySelectorAll('#pin_input').forEach((item) =>{
    item.addEventListener('blur', e=>{
        strPin=e.target.value;
        if((validateCc1(strCc1))&&(validateBirthday(strBirthday))&&(validatePin(strPin))){
            $("#submit_btn").removeClass("active");
            $("#submit_btn").removeClass("disabled")
        }else{
            $("#submit_btn").addClass("active");
            $("#submit_btn").addClass("disabled")
        }
    })
});



// 새 카드 저장 시 레이어 창




/**
 * 🤍 기능11 카드 리스트 드롭다운
 * 클릭시 fetch 비동기 리스트 출력
 * 선택시 반영하고 닫기
 */
const card_drop_btn = document.querySelector('.clickable_card img')
const main_card = document.querySelector('.main_card .clickable_card')
console.log(card_drop_btn)
const card_drop_div = document.querySelector('.other_card')
card_drop_btn.addEventListener('click',()=>{
    if(card_drop_div.style.display=='none'){
        card_drop_div.style.display='block'
    }else{
        card_drop_div.style.display='none'
    }
})
const cards = document.querySelectorAll('.other_card_item')
cards.forEach((card)=>{
    card.addEventListener('click',()=>{
        main_card.childNodes[1].innerHTML = card.childNodes[1].innerHTML
        card_drop_div.style.display='none'
    })
})

//결재 방법 선택시 테두리 효과
const items = document.querySelectorAll(".method");
items.forEach((item)=>{
    item.addEventListener('click',()=>{
        items.forEach((e)=>{
            e.classList.remove('selected');
        })
    item.classList.add('selected');
    })
})


/**
 * 🤍 기능12 체크 박스 모두 선택 시 결재하기 버튼 활성화
 */
const checks = document.querySelectorAll(".check");
console.log(checks)
checks.forEach((check)=>{
    check.addEventListener('click',getCheck)
})
function getCheck() {
    const query = 'input[class=check]:checked';
    const selectedElements = document.querySelectorAll(query);
    const cnt = selectedElements.length;
    if (cnt == 4) {
        document.querySelector('#submit').classList.remove('disabled')
    } else {
        document.querySelector('#submit').className = 'btn full solid disabled';
    }
}

/**
 * 🤍 기능13 결재하기 버튼 클릭시 경고창 이후 결재완료페이지
 * fetch로 구매등록
 * 결재완료 페이지
 */
function pop_order_price_confirm(){
    document.querySelector('.layer_order_price_confirm .price').innerHTML=
        document.querySelector('.buy_total_confirm .price .amount').innerHTML + "원"
    const btn_submit = document.getElementById('real_submit');
    btn_submit.addEventListener('click',sendit);
    document.querySelector('.layer_order_price_confirm').style.display="block"
}
function sendit() {
    //request로 필요한 DOM 객체 선택
    const productIdx = document.querySelector('.product_idx');
    const cardInfo = document.getElementById('cardInfo');
    const receiver = document.getElementById('receiver');
    const receiverHp = document.getElementById('receiverHp');
    const receiverAddress = document.getElementById('receiverAddress');
    card_info = "BC "+"****-****-****-"+ cardInfo.innerHTML
    fetch('http://localhost:8889/api/order/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            //우리가 만든데이터
            "transaction_time":`${new Date()}`,
            "resultCode":"ok",
            "description":"정상",
            "data":{
                "productIdx": productIdx.innerHTML,
                "isNow":is_now,
                "price":wish_price,
                "period":period,
                "usePoint":use_point,
                "cardInfo":card_info,
                "receiver": receiver.innerHTML,
                "receiverHp":receiverHp.innerHTML,
                "receiverAddress":receiverAddress.innerHTML,
                "deliveryMemo":delivery_memo
            }
        }),
    })
        .then((res) => {
            alert('등록성공')
            location.href='/my';
            return; //리턴을 걸어서 진행하는 것을 막는다!
        })
        .then((data) => {
            console.log(data);
            return;
        })
        .catch((err)=>{
            alert(err);
        })
}
function close_order_price_confirm(){
    document.querySelector('.layer_order_price_confirm').style.display="none"
}