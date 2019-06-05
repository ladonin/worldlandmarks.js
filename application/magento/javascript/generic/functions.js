$.fn.wait = function (time, type) {
    time = time || 1000;
    type = type || "fx";
    return this.queue(type, function () {
        var self = this;
        setTimeout(function () {
            $(self).dequeue();
        }, time);
    });
};
$.fn.preload = function () {
    this.each(function () {
        $('<img/>')[0].src = this;
    });
}
// Использование:
//$(['img1.jpg','img2.jpg','img3.jpg']).preload();





Array.prototype.count = function() {
    var cnt = 0;
    for(k in this) {
      if(this[k] != undefined) {
        cnt++;
      }
   }
   return cnt>0?cnt-1:0;
};







function my_get_message(text, type, timer_enable, eval_text) {




    function show(class_name) {

        if (typeof (alert_timer) !== 'undefined') {
            clearTimeout(alert_timer);
        }

        $('#alert').removeClass().addClass(class_name);
        $('#alert div').html(text)
        $('#alert').slideDown(200).promise().always(function (result) {
            //если надо вызвать что-то после появления сообщения, а не до (для асинхронных функций)
            if ((typeof (eval_text) !== 'undefined') && (eval_text)) {
                eval(eval_text);
            }
        });

        $('#alert').click(function () {
            hide();
        });

        //scroll_to_top();

        if ((typeof (timer_enable) === 'undefined') || ((typeof (timer_enable) !== 'undefined') && (timer_enable === true))) {
            alert_timer = setTimeout(function () {
                hide();
            }, 5000);
        }


    }

    function hide() {
        $('#alert').slideUp(100);
    }


    show(type);

}

function scroll_to_top() {
    $('body:not(:animated),html:not(:animated)').animate({scrollTop: 0}, 400)
}

function view_cropped_photo(path, width_original, height_original, width_new, height_new) {

    var left = 0, top = 0, width = 0, height = 0;

    var diff_original = width_original / height_original;
    var diff_new = width_new / height_new;

    if (diff_original > diff_new) {//если картинка шире чем блок
        //значит кропаем по горизонтали
        height = height_new;
        width = height * diff_original;
        left = (width_new - width) / 2;

    } else if (diff_original < diff_new) {//если картинка уже чем блок
        //значит кропаем по вертикали
        width = width_new;
        height = width / diff_original;
        top = (height_new - height) / 2;

    } else {
        width = width_new;
        height = height_new;
    }

    var result = "<div class='cropped_image_div' style='width:" + width_new + "px; height:" + height_new + "px; overflow:hidden'>";
    result += "<img src='"+ path + "' style='width:" + width + "px; height:" + height + "px; position:relative; top:" + top + "px; left:" + left + "px;'>";
    result += '</div>';
    return result;
}

function getRandomInt(min, max)
{
    return min;///////////////////////Math.floor(Math.random() * (max - min + 1)) + min;
}



function kick_1_nicescroll(id) {
    // Переводим скролл вверх, если вдруг он не там
    document.getElementById(id).scrollTop = 0;
    // "Запускаем" это говно
    $('#' + id).append('<br>');
}




function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}


$(document).on("click", function () {

});