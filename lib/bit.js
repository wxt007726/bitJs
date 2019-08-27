if (typeof window['$'] == 'undefined') {
    console.log('%c' + 'Please introduce JQ first from 491915069@qq.com!', 'color:red');
}
else if (typeof window['$'] == 'function') {
    console.log('%c' + 'Welcome to use bit.js created by 491915069@qq.com!', 'color:green');
    console.log(window);
    var $ = window['$'];
    (function ($) {
        "use strict";
        var localstorage = localStorage || window.localStorage;
        var baseUrl = window['bitconfig'].getBaseUrl();
        var goLogin = window['bitconfig'].goLoginFn;
        /**
         * bitrender 自定义的标签的额渲染
         * @created  wangxiaotian
         * */
        $.bitrender = function () {
            //bit-input
            $(document).find('bit-input').each(function () {
                if (($(this).text().replace(/\s/g, "")) == '') {
                    var bitinputvalStr = $.isNoValid($(this).attr('inputval')) ? '' : $(this).attr('inputval');
                    var bitautoheightStr = $(this).attr('bitautoheight');
                    var bitvalidateStr = $(this).attr('bitvalidate');
                    var placeholderStr = $(this).attr('bitplaceholder') ? $(this).attr('bitplaceholder') : '请输入';
                    var bitInputHtml = "<div class=\"bit-input-com\">\n                                            <textarea class=\"bit-textarea\" bitinput placeholder=\"" + placeholderStr + "\" \n                                             " + (bitautoheightStr != undefined ? 'bitautoheight' : '') + "  \n                                             " + (bitvalidateStr != undefined ? 'bitvalidate="' + bitvalidateStr + '"' : '') + "\n                                            >" + bitinputvalStr + "</textarea>\n                                        </div>";
                    $(this).html(bitInputHtml);
                }
            });
            //bit-select
            $(document).find('bit-select').each(function () {
                if (($(this).text().replace(/\s/g, "")) == '') {
                    var bitselectvalStr = $.isNoValid($(this).attr('selectval')) ? '' : $(this).attr('selectval');
                    var placeholderStr = $(this).attr('bitplaceholder') ? $(this).attr('bitplaceholder') : '请选择';
                    var bitSelectHtml = "<div class=\"bit-select-com\">\n                                            " + (bitselectvalStr != '' ? '<span class="bit-select-span">' + bitselectvalStr + '</span>' : '<span class="bit-select-span palceholder">' + placeholderStr + '</span>') + "\n                                            <i class=\"icon iconfont icon-caret-down\"></i>\n                                        </div>";
                    $(this).html(bitSelectHtml);
                }
            });
            //bit-date
            $(document).find('bit-date').each(function () {
                if (($(this).text().replace(/\s/g, "")) == '') {
                    var bitdatevalStr = $.isNoValid($(this).attr('dateval')) ? '' : $(this).attr('dateval');
                    var placeholderStr = $(this).attr('bitplaceholder') ? $(this).attr('bitplaceholder') : '请选择';
                    var bitDateHtml = "<div class=\"bit-date-com\">\n                                            " + (bitdatevalStr != '' ? '<span class="bit-date-span">' + bitdatevalStr + '</span>' : '<span class="bit-date-span palceholder">' + placeholderStr + '</span>') + "\n                                            <i class=\"icon iconfont icon-caret-down\"></i>\n                                        </div>";
                    $(this).html(bitDateHtml);
                }
            });
            //bitupload
            $(document).find('[bitupload]').each(function () {
                if ($(this).find('.js-bitinput-file').length == 0) {
                    if ($(this).css('position') == 'static') {
                        $(this).css('position', 'relative');
                    }
                    ;
                    var resBack_1 = $(this).attr('bitupload');
                    var bitaccept = $(this).attr('bitaccept') ? $(this).attr('bitaccept') : '';
                    var bitcapture = $(this).attr('bitcapture') ? $(this).attr('bitcapture') : '';
                    var inputFileHtml = "<input class=\"js-bitinput-file\" type=\"file\" \n                                            " + (bitaccept ? ('accept="' + bitaccept + '"') : "") + "\n                                            " + (bitcapture ? ('capture="' + bitcapture + '"') : "") + "\n                                            style=\"position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0 !important;\"\n                                        />";
                    $(inputFileHtml).appendTo($(this));
                    $(this).find('.js-bitinput-file').on('change', function (event) {
                        $.bitupload(event, resBack_1);
                    });
                }
            });
        };
        /**
         * bitinit 初始化
         * @created  wangxiaotian
         * */
        $.bitinit = function () {
            //渲染自定义标签
            $.bitrender();
            //设置content的高度
            var bitheader = $('.bit-header').height() ? $('.bit-header').height() : 0;
            var bitfooter = $('.bit-footer').height() ? $('.bit-footer').height() : 0;
            $('.bit-content').css('height', "calc(100% - " + (bitheader + bitfooter) + "px)");
            //监听textarea 设置textarea输入时适应高度；
            $(document).on('input propertychange', '.bit-textarea[bitautoheight]', function () {
                $(this).css('height', '2rem');
                $(this).css('height', $(this)[0].scrollHeight + 'px');
            });
            //监听bitinput
            $(document).on('input propertychange', '[bitinput]', function () {
                var inputVal = $(this).val();
                if ($.isNoValid(inputVal)) {
                    $(this).parents('bit-input').removeAttr('inputval');
                }
                else {
                    $(this).parents('bit-input').attr('inputval', inputVal);
                }
                if (!$.isNoValid($(this).attr('(bitchange)'))) {
                    eval("" + $(this).attr('(bitchange)'));
                }
            });
            //失去焦点的时候验证数据
            $(document).on('blur', '[bitvalidate]', function (e) {
                var _thisVal = e.target.value;
                var validateStr = $(this).attr('bitvalidate');
                var validateType = validateStr.split(',')[0];
                var validateRes;
                if (validateStr.split(',')[1]) {
                    validateRes = validateStr.split(',')[1].split('(')[0];
                }
                console.log('验证指令', $.bittrim(validateType));
                switch ($.bittrim(validateType)) {
                    case 'mobile':
                        if (validateRes) {
                            eval(validateRes + "('" + $.bitmobileValidateFn(_thisVal) + "')");
                        }
                        break;
                    case 'idcard':
                        if (validateRes) {
                            eval(validateRes + "('" + $.bitidcardValidateFn(_thisVal) + "')");
                        }
                        break;
                    case 'number':
                        if (validateRes) {
                            eval(validateRes + "('" + $.bitnumberValidateFn(_thisVal) + "')");
                        }
                        break;
                    case 'novalid':
                        if (validateRes) {
                            eval(validateRes + "('novalid')");
                        }
                        break;
                    default:
                        break;
                }
            });
            //===================//
            //==***bitselect***==//
            //===================//
            //将选项数据保存到元素上 ***需要手动调用***
            $.fn.bitselect = function (options, title, config) {
                if (options instanceof Array) {
                    var defaultConfig = {
                        key: 'dicKey',
                        value: 'dicValue'
                    };
                    var setConfig = Object.assign(defaultConfig, config);
                    this.each(function () {
                        var _this = $(this);
                        _this.data('bit-select-option', JSON.stringify(options));
                        _this.data('bit-select-title', title ? title : '');
                        _this.data('bit-select-config', JSON.stringify(setConfig));
                        //只有一个选项时 选中
                        if (options.length == 1) {
                            _this.attr('selectkey', options[0][setConfig.key]);
                            _this.attr('selectval', options[0][setConfig.value]);
                            _this.trigger('bitSelectWatch');
                        }
                    });
                }
                else {
                    console.error("$(...).bitselect\u4F20\u5165\u7684\u53C2\u6570 " + options + " \u5E94\u4E3A\u4E00\u4E2A\u6570\u7EC4");
                }
            };
            //打开selectModal
            $(document).on('tap click', 'bit-select', function () {
                var _this = $(this);
                var selectOption = _this.data('bit-select-option');
                var selectTitle = _this.data('bit-select-title');
                var selectConfig = _this.data('bit-select-config');
                var selectKey = _this.attr('selectkey') ? _this.attr('selectkey') : '';
                var selectVal = _this.attr('selectval') ? _this.attr('selectval') : '';
                if (selectOption instanceof Array) {
                    var optionHtml = '';
                    if (selectOption.length > 1) {
                        $(selectOption).each(function (index, val) {
                            optionHtml += " <div class=\"bit-select-option " + (selectKey == val[selectConfig.key] ? 'active' : '') + "\" \n                                            bitKey=\"" + val[selectConfig.key] + "\" bitVal=\"" + val[selectConfig.value] + "\">\n                                                <div class=\"bit-select-option-l\">\n                                                    <i class=\"icon iconfont icon-check-circle-fill\"></i>\n                                                </div>\n                                                <div class=\"bit-select-option-r\">\n                                                    <span>" + val[selectConfig.value] + "</span>\n                                                </div>\n                                            </div>";
                        });
                    }
                    else {
                        optionHtml = "<span class=\"bit-select-tip\">\u6682\u65E0\u9009\u9879\u6570\u636E</span>";
                    }
                    var bitselectHtml = "<div class=\"bit-select-modal bit-modal-background bit-scale-in-animation\">\n                                            <div class=\"bit-select-container\">\n                                                <div class=\"bit-select-title\">\n                                                    <span>\u8BF7\u9009\u62E9" + selectTitle + "</span>\n                                                </div>\n                                                <div class=\"bit-select-content\">\n                                                    <div class=\"bit-select-scroll\">\n                                                        " + optionHtml + "\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>";
                    $(bitselectHtml).appendTo('body');
                    var selectOptionActive = $('.bit-select-option.active');
                    var selectContent = $('.bit-select-content');
                    var selectContentHeight = selectContent[0].offsetHeight;
                    var activeToTop = 0;
                    if (selectOptionActive.length == 1) {
                        $('.bit-select-option').each(function () {
                            activeToTop += this.offsetHeight;
                            if ($(this).hasClass('active')) {
                                return false;
                            }
                        });
                        if (activeToTop > selectContentHeight / 2) {
                            selectContent.scrollTop(+activeToTop - +selectContentHeight / 2);
                        }
                    }
                    $(document).on('tap click', '.bit-select-modal', function () {
                        var timer = setTimeout(function () {
                            $('.bit-select-modal').remove();
                            $(document).off('tap click', '.bit-select-option');
                            $(document).off('tap click', '.bit-select-modal');
                            clearTimeout(timer);
                        }, 0);
                    });
                    $(document).on('tap click', '.bit-select-option', function () {
                        if (selectKey != $(this).attr('bitKey')) {
                            _this.attr('selectkey', $(this).attr('bitKey'));
                            _this.attr('selectval', $(this).attr('bitVal'));
                            $(this).addClass('active');
                            //linkage的处理
                            if (_this.hasClass('js-bit-linkage-a')) {
                                _this.parents('bit-linkage').removeAttr('linkagekey');
                                _this.parents('bit-linkage').removeAttr('linkageval');
                            }
                            _this.trigger('bitSelectWatch');
                        }
                    });
                }
                else {
                    console.error("\u8BF7\u5148\u4F20\u5165\u6B63\u786E\u7684\u9009\u9879\u6570\u636E,\u4F7F\u7528 $(...).bitselect()");
                }
            });
            //监听bitselect
            $(document).on('bitSelectWatch', 'bit-select', function () {
                var selectVal = $(this).attr('selectval');
                if ($.isNoValid(selectVal)) {
                    $(this).find('.bit-select-span').addClass('palceholder').text('请选择');
                }
                else {
                    $(this).find('.bit-select-span').removeClass('palceholder').text(selectVal);
                }
                ;
                if (!$.isNoValid($(this).attr('(bitchange)'))) {
                    eval("" + $(this).attr('(bitchange)'));
                }
                if ($(this).hasClass('js-bit-linkage-a')) {
                    var _thisSelectKey = $(this).attr('selectkey');
                    var _thisParentsoptions = $(this).parents('bit-linkage').data('bit-linkage-option')[1]['options'];
                    var _thisParentConfig = $(this).parents('bit-linkage').data('bit-linkage-config');
                    var _thisParentTitle = $(this).parents('bit-linkage').data('bit-linkage-title');
                    var bitlinkageSelectkeyB;
                    if (!$.isNoValid($(this).parents('bit-linkage').attr('linkagekey'))) {
                        bitlinkageSelectkeyB = $(this).parents('bit-linkage').attr('linkagekey').split(' ')[1];
                        bitlinkageSelectkeyB = $.isNoValid(bitlinkageSelectkeyB) ? '' : bitlinkageSelectkeyB;
                    }
                    var bitlinkageSelectvalB;
                    if (!$.isNoValid($(this).parents('bit-linkage').attr('linkageval'))) {
                        bitlinkageSelectvalB = $(this).parents('bit-linkage').attr('linkageval').split(' ')[1];
                        bitlinkageSelectvalB = $.isNoValid(bitlinkageSelectvalB) ? '' : bitlinkageSelectvalB;
                    }
                    var bitlinkageOptionsB = [];
                    var bitlinkageb = $(this).parents('bit-linkage').find('.linkage-b');
                    if (_thisParentsoptions.length > 0) {
                        _thisParentsoptions.forEach(function (val) {
                            if (val.parentVal == _thisSelectKey) {
                                bitlinkageOptionsB.push(val);
                            }
                        });
                        if (bitlinkageOptionsB.length > 0) {
                            bitlinkageb.find('.bit-item-r').html("<bit-select class=\"js-bit-linkage-b\" " + (bitlinkageSelectkeyB ? 'selectkey="' + bitlinkageSelectkeyB + '"' : '') + " " + (bitlinkageSelectvalB ? 'selectval="' + bitlinkageSelectvalB + '"' : '') + " bitplaceholder=\"\u8BF7\u9009\u62E9" + _thisParentTitle.split('_')[1] + "\"></bit-select>");
                            bitlinkageb.find('.js-bit-linkage-b').bitselect(bitlinkageOptionsB, '', _thisParentConfig);
                            $.bitrender();
                            $(this).parents('bit-linkage').trigger('bitLinkageWatch');
                        }
                    }
                    else {
                        console.error("linkage\u7684\u7B2C\u4E8C\u7EA7\u9009\u9879\u6570\u636E " + _thisParentsoptions + " \u9519\u8BEF;");
                    }
                }
                if ($(this).hasClass('js-bit-linkage-b')) {
                    $(this).parents('bit-linkage').trigger('bitLinkageWatch');
                }
            });
            //===================//
            //===***bitdate***===//
            //===================//
            //<div class="date_select_opt"><span>01</span></div>
            //打开dateModal
            $(document).on('tap click', 'bit-date', function () {
                var _this = this;
                var checkY = 0;
                var checkM = 0;
                var checkD = 0;
                var startY = 0;
                var moveY = 0;
                var scrollTop = 0;
                var yDiv = null;
                var mDiv = null;
                var dDiv = null;
                var arrY = [];
                var arrM = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                var arrD = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
                var nowDate = new Date();
                var nowdate = nowDate.getFullYear() + "-" + ((nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1)) + "-" + (nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate());
                var nowdate100 = nowDate.getFullYear() + 100 + "-" + ((nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1)) + "-" + (nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate());
                var startDate = $(this).attr('dateval') ? $(this).attr('dateval') : nowdate;
                var minDate = $(this).attr('bitmin') ? $(this).attr('bitmin') : '1949-01-01';
                var maxDate = $(this).attr('bitmax') ? $(this).attr('bitmax') : nowdate100;
                if (new Date(startDate).getTime() - new Date(minDate).getTime() < 0) {
                    startDate = minDate;
                }
                ;
                if (new Date(maxDate).getTime() - new Date(minDate).getTime() < 0) {
                    alert('日期最大最小值错误');
                    return false;
                }
                ;
                if (startDate && ((new Date(maxDate).getTime() - new Date(startDate).getTime() < 0))) {
                    alert('默认日期错误');
                    return false;
                }
                ;
                //生成年份
                var minY = minDate.split('-')[0];
                var maxY = maxDate.split('-')[0];
                var minM = minDate.split('-')[1];
                var maxM = maxDate.split('-')[1];
                var minD = minDate.split('-')[2];
                var maxD = maxDate.split('-')[2];
                var lenY = +maxY - +minY + 1;
                for (var i = 0; i < lenY; i++) {
                    arrY.push("" + (+minY + i));
                }
                ;
                var bitdateHtml = " <div class=\"bit-date-modal bit-date-modal-background-transparent bit-bottom-in-animation\">\n                                        <div class=\"bit-date-container\">\n                                            <div class=\"date_btn_div\">\n                                                <a class=\"bit-button color-cancel js-date-cancel\" href=\"javascript:void(0)\">\u53D6\u6D88</a>\n                                                <span class=\"y-line\"></span>\n                                                <a class=\"bit-button color-ok js-date-ok\" href=\"javascript:void(0)\">\u786E\u5B9A</a>\n                                            </div>\n                                            <div class=\"date_select_div\">\n                                                <div class=\"date_scroll_div\">\n                                                    <div class=\"date_select_col y_div\">\n                                                        <div class=\"date_select_content\">\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class=\"date_scroll_div\">\n                                                    <div class=\"date_select_col m_div\">\n                                                        <div class=\"date_select_content\">\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class=\"date_scroll_div\">\n                                                    <div class=\"date_select_col d_div\">\n                                                        <div class=\"date_select_content\">\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class=\"scroll_div\">\n                                                    <div id=\"js_bit-date-arry\"></div>\n                                                    <div id=\"js_bit-date-arrm\"></div>\n                                                    <div id=\"js_bit-date-arrd\"></div>\n                                                </div>\n                                            </div>                                \n                                        </div>\n                                    </div>";
                $(bitdateHtml).appendTo('body');
                yDiv = $('.y_div')[0];
                mDiv = $('.m_div')[0];
                dDiv = $('.d_div')[0];
                retrunYHtml();
                retrunMHtml();
                retrunDHtml();
                //初始选中
                if (startDate != '') {
                    var startY_1 = startDate.split('-')[0];
                    var startM = startDate.split('-')[1];
                    var startD = startDate.split('-')[2];
                    checkY = (arrY.indexOf(startY_1) != -1) ? arrY.indexOf(startY_1) : 0;
                    retrunMonthsFn();
                    checkM = (arrM.indexOf(startM) != -1) ? arrM.indexOf(startM) : 0;
                    retrunDaysFn();
                    checkD = (arrD.indexOf(startD) != -1) ? arrD.indexOf(startD) : 0;
                    yDiv.scrollTop = checkY * 50;
                    mDiv.scrollTop = checkM * 50;
                    dDiv.scrollTop = checkD * 50;
                }
                //年 滑动
                $('#js_bit-date-arry').on('touchstart', function (e) {
                    touchstartFnY(e);
                });
                $('#js_bit-date-arry').on('touchmove', function (e) {
                    touchmoveFnY(e);
                });
                $('#js_bit-date-arry').on('touchend', function (e) {
                    touchendFnY(e);
                });
                //月 滑动
                $('#js_bit-date-arrm').on('touchstart', function (e) {
                    touchstartFnM(e);
                });
                $('#js_bit-date-arrm').on('touchmove', function (e) {
                    touchmoveFnM(e);
                });
                $('#js_bit-date-arrm').on('touchend', function (e) {
                    touchendFnM(e);
                });
                //日 滑动
                $('#js_bit-date-arrd').on('touchstart', function (e) {
                    touchstartFnD(e);
                });
                $('#js_bit-date-arrd').on('touchmove', function (e) {
                    touchmoveFnD(e);
                });
                $('#js_bit-date-arrd').on('touchend', function (e) {
                    touchendFnD(e);
                });
                //点击确定
                $('.js-date-ok').on('tap click', function () {
                    var retrunY = arrY[checkY] ? arrY[checkY] : arrY[arrY.length - 1];
                    var retrunM = arrM[checkM] ? arrM[checkM] : arrM[arrM.length - 1];
                    var retrunD = arrD[checkD] ? arrD[checkD] : arrD[arrD.length - 1];
                    var retrunYMD = retrunY + "-" + retrunM + "-" + retrunD;
                    if (Date.parse(retrunYMD) >= Date.parse(minDate) && Date.parse(retrunYMD) <= Date.parse(maxDate)) {
                        console.log(retrunYMD);
                        $(_this).attr('dateval', "" + retrunYMD);
                        $(_this).trigger('bitDateWatch');
                        $('.bit-date-modal').remove();
                    }
                    else {
                        console.error('未知日期错误');
                    }
                });
                //点击取消
                $('.js-date-cancel').on('tap click', function () {
                    $('.bit-date-modal').remove();
                });
                //返回年html
                function retrunYHtml() {
                    if (arrY.length > 0) {
                        var yHtml = '';
                        arrY.forEach(function (val, index) {
                            yHtml += "<div class=\"date_select_opt\"><span>" + val + "</span></div>";
                        });
                        $('.y_div .date_select_content').html(yHtml);
                    }
                    else {
                        console.error("\u5E74\u4EFDarrY" + arrY + "\u4E3A\u7A7A");
                    }
                }
                //返回月html
                function retrunMHtml() {
                    if (arrM.length > 0) {
                        var mHtml = '';
                        arrM.forEach(function (val, index) {
                            mHtml += "<div class=\"date_select_opt\"><span>" + val + "</span></div>";
                        });
                        $('.m_div .date_select_content').html(mHtml);
                    }
                    else {
                        console.error("\u6708\u4EFDarrM" + arrM + "\u4E3A\u7A7A");
                    }
                }
                //返回日html
                function retrunDHtml() {
                    if (arrD.length > 0) {
                        var dHtml = '';
                        arrD.forEach(function (val, index) {
                            dHtml += "<div class=\"date_select_opt\"><span>" + val + "</span></div>";
                        });
                        $('.d_div .date_select_content').html(dHtml);
                    }
                    else {
                        console.error("\u65E5\u671FarrD" + arrD + "\u4E3A\u7A7A");
                    }
                }
                //YYYY
                function touchstartFnY(e) {
                    startY = e.targetTouches[0].pageY;
                    scrollTop = yDiv.scrollTop;
                }
                function touchmoveFnY(e) {
                    moveY = e.targetTouches[0].pageY;
                    var moveNum = ((moveY - startY) * -1).toFixed(0);
                    yDiv.scrollTop = +scrollTop + +moveNum;
                }
                function touchendFnY(e) {
                    yDiv.scrollTop = Math.floor((yDiv.scrollTop - 25) / 50 + 1) * 50;
                    checkY = +(yDiv.scrollTop / 50).toFixed(0);
                    retrunMonthsFn();
                    retrunDaysFn();
                }
                //MMMM
                function touchstartFnM(e) {
                    startY = e.targetTouches[0].pageY;
                    scrollTop = mDiv.scrollTop;
                }
                function touchmoveFnM(e) {
                    moveY = e.targetTouches[0].pageY;
                    var moveNum = ((moveY - startY) * -1).toFixed(0);
                    mDiv.scrollTop = +scrollTop + +moveNum;
                }
                function touchendFnM(e) {
                    mDiv.scrollTop = Math.floor((mDiv.scrollTop - 25) / 50 + 1) * 50;
                    checkM = +(mDiv.scrollTop / 50).toFixed(0);
                    retrunDaysFn();
                }
                //DDDD
                function touchstartFnD(e) {
                    startY = e.targetTouches[0].pageY;
                    scrollTop = dDiv.scrollTop;
                }
                function touchmoveFnD(e) {
                    moveY = e.targetTouches[0].pageY;
                    var moveNum = ((moveY - startY) * -1).toFixed(0);
                    dDiv.scrollTop = +scrollTop + +moveNum;
                }
                function touchendFnD(e) {
                    dDiv.scrollTop = Math.floor((dDiv.scrollTop - 25) / 50 + 1) * 50;
                    checkD = +(dDiv.scrollTop / 50).toFixed(0);
                }
                //根据选中的年来返回月
                function retrunMonthsFn() {
                    var indexY = arrY[checkY];
                    var indexYminM = (+indexY == +minY) ? minM : '01';
                    var indexYmaxM = (+indexY == +maxY) ? maxM : '12';
                    arrM = [];
                    for (var m = 0; m < (+indexYmaxM - +indexYminM + 1); m++) {
                        arrM.push(((+indexYminM + m) < 10) ? ('0' + (+indexYminM + m)) : ((+indexYminM + m) + ''));
                    }
                    retrunMHtml();
                    return arrM;
                }
                //根据选中年月来判断当月有多少天
                function retrunDaysFn() {
                    var indexY = arrY[checkY];
                    if (checkM > arrM.length - 1) {
                        checkM = 0;
                    }
                    var indexM = arrM[checkM];
                    var indexMdays = new Date(+indexY, +indexM, 0).getDate();
                    var indexYMminD = '01';
                    var indexYMmmaxD = indexMdays + '';
                    if (+indexY == +minY) {
                        indexYMminD = (+indexM == +minM) ? minD : '01';
                    }
                    else {
                        indexYMminD = '01';
                    }
                    ;
                    if (+indexY == +maxY) {
                        indexYMmmaxD = (+indexM == +maxM) ? maxD : indexMdays + '';
                    }
                    else {
                        indexYMmmaxD = indexMdays + '';
                    }
                    ;
                    arrD = [];
                    for (var d = 0; d < ((+indexYMmmaxD) - (+indexYMminD) + 1); d++) {
                        arrD.push(((+indexYMminD + d) < 10) ? ('0' + (+indexYMminD + d)) : ((+indexYMminD + d) + ''));
                    }
                    ;
                    retrunDHtml();
                    return arrD;
                }
            });
            //监听bitdate
            $(document).on('bitDateWatch', 'bit-date', function () {
                var dateVal = $(this).attr('dateval');
                if ($.isNoValid(dateVal)) {
                    $(this).find('.bit-date-span').addClass('palceholder').text('请选择');
                }
                else {
                    $(this).find('.bit-date-span').removeClass('palceholder').text(dateVal);
                }
                if (!$.isNoValid($(this).attr('(bitchange)'))) {
                    eval("" + $(this).attr('(bitchange)'));
                }
            });
            //===================//
            //==***bitlinkage***==//
            //===================//
            //将选项数据保存到元素上 ***需要手动调用***
            $.fn.bitlinkage = function (options, title, config) {
                if (title && title.indexOf('_') != -1 && title.indexOf('_') != 0) { }
                else {
                    console.error("\u53C2\u6570\uFF1A" + title + " \u7684\u683C\u5F0F\u5E94\u4E3A xx_xx;");
                    return false;
                }
                if (options instanceof Array && options.length >= 2) {
                    var defaultConfig = {
                        key: 'value',
                        value: 'text'
                    };
                    var setConfig = Object.assign(defaultConfig, config);
                    this.each(function () {
                        var _this = $(this);
                        _this.data('bit-linkage-option', JSON.stringify(options));
                        _this.data('bit-linkage-title', title);
                        _this.data('bit-linkage-config', JSON.stringify(setConfig));
                        if (($(this).text().replace(/\s/g, "")) == '') {
                            var bitnullable = ($(this).attr('bitnullable') ? $(this).attr('bitnullable') : '') || ($(this).hasClass('bt') ? '0' : '');
                            var bitlinkagetitleStr = $(this).data('bit-linkage-title');
                            var bitlinkagekeyStrA;
                            if (!$.isNoValid($(this).attr('linkagekey'))) {
                                bitlinkagekeyStrA = $(this).attr('linkagekey').split(' ')[0] ? $(this).attr('linkagekey').split(' ')[0] : '';
                            }
                            var bitlinkagevalStrA;
                            if (!$.isNoValid($(this).attr('linkageval'))) {
                                bitlinkagevalStrA = $(this).attr('linkageval').split(' ')[0] ? $(this).attr('linkageval').split(' ')[0] : '';
                            }
                            var bitlinkagetitleStrA = bitlinkagetitleStr.split('_')[0];
                            var bitlinkagetitleStrB = bitlinkagetitleStr.split('_')[1];
                            var bitDateHtml = "<div class=\"bit-item linkage-a\">\n                                                    <div class=\"bit-item-l\">\n                                                        <span class=\"bit-item-t " + (bitnullable == '0' ? 'bt' : '') + "\">" + bitlinkagetitleStrA + "</span>\n                                                        <span>:</span>\n                                                    </div>\n                                                    <div class=\"bit-item-r\">\n                                                        <bit-select class=\"js-bit-linkage-a\" " + (bitlinkagekeyStrA ? 'selectkey="' + bitlinkagekeyStrA + '"' : '') + " " + (bitlinkagevalStrA ? 'selectval="' + bitlinkagevalStrA + '"' : '') + " bitplaceholder=\"\u8BF7\u9009\u62E9" + bitlinkagetitleStrA + "\"></bit-select>\n                                                    </div>\n                                                </div>\n                                                <div class=\"bit-item  linkage-b\">\n                                                    <div class=\"bit-item-l\">\n                                                        <span class=\"bit-item-t " + (bitnullable == '0' ? 'bt' : '') + "\">" + bitlinkagetitleStrB + "</span>\n                                                        <span>:</span>\n                                                    </div>\n                                                    <div class=\"bit-item-r\">\n                                                        <span class=\"placeholder\">\u8BF7\u5148\u9009\u62E9" + bitlinkagetitleStrA + "</span>                                                \n                                                    </div>\n                                                </div>";
                            $(this).html(bitDateHtml);
                            var bitlinkageOptionsA = options[0]['options'];
                            $(this).find('.js-bit-linkage-a').bitselect(bitlinkageOptionsA, bitlinkagetitleStrA, setConfig);
                            $.bitrender();
                            $(this).find('.js-bit-linkage-a').trigger('bitSelectWatch');
                        }
                    });
                }
                else {
                    console.error("$(...).bitlinkage\u4F20\u5165\u7684\u53C2\u6570 " + options + " \u5E94\u4E3A\u4E00\u4E2A\u6570\u7EC4\u4E14\u957F\u5EA6\u81F3\u5C11\u4E3A2;");
                }
            };
            //监听bitlinkage
            $(document).on('bitLinkageWatch', 'bit-linkage', function () {
                var selectkeyA = $(this).find('.js-bit-linkage-a').attr('selectkey');
                var selectvalA = $(this).find('.js-bit-linkage-a').attr('selectval');
                var selectkeyB = $(this).find('.js-bit-linkage-b').attr('selectkey');
                var selectvalB = $(this).find('.js-bit-linkage-b').attr('selectval');
                if (!$.isNoValid(selectkeyA) && !$.isNoValid(selectvalA) && !$.isNoValid(selectkeyB) && !$.isNoValid(selectvalB)) {
                    $(this).attr('linkagekey', selectkeyA + " " + selectkeyB);
                    $(this).attr('linkageval', selectvalA + " " + selectvalB);
                }
                else {
                    $(this).removeAttr('linkagekey');
                    $(this).removeAttr('linkageval');
                }
                if (!$.isNoValid($(this).attr('(bitchange)'))) {
                    eval("" + $(this).attr('(bitchange)'));
                }
            });
        },
            /**
             * bitmobileValidateFn
             * @param val:验证手机与座机
             * @created  wangxiaotian
             * */
            $.bitmobileValidateFn = function (val) {
                var valRegmobile1 = /^1[3456789]\d{9}$/g; //手机
                var valRegmobile2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/; //座机
                var regmobileboolean1 = valRegmobile1.test(val);
                var regmobileboolean2 = valRegmobile2.test(val);
                if (val != '' && val != ' ') {
                    if (regmobileboolean1 || regmobileboolean2) {
                        return 'success';
                    }
                    else {
                        return 'fail';
                    }
                }
                else {
                    return 'invalid';
                }
            },
            /**
             * bitidcardValidateFn
             * @param val:验证身份证 15位或1818位;
             * @created  wangxiaotian
             * */
            $.bitidcardValidateFn = function (val) {
                var valReg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/g; //15位
                var valReg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g; //18位
                var regidcard15boolean = valReg15.test(val);
                var regidcard18boolean = valReg18.test(val);
                if (val != '' && val != ' ') {
                    if (regidcard15boolean || regidcard18boolean) {
                        return 'success';
                    }
                    else {
                        return 'fail';
                    }
                }
                else {
                    return 'invalid';
                }
            },
            /**
             * bitnumberValidateFn
             * @param val:验证是否数字 整数 浮点数 大于0
             * @created  wangxiaotian
             * */
            $.bitnumberValidateFn = function (val) {
                var valRegnum = /(^[1-9]\d*$|0$)|(^[1-9]\d*\.\d*$|0\.\d*[1-9]\d*$|0?\.0+$|0$)/g;
                var regnumboolean = valRegnum.test(val);
                if (val.match(/\./g) != null) {
                    if (val.match(/\./g).length != 1) {
                        regnumboolean = false;
                    }
                }
                if (val != '' && val != ' ') {
                    if (regnumboolean) {
                        return 'success';
                    }
                    else {
                        return 'fail';
                    }
                }
                else {
                    return 'invalid';
                }
            },
            /**
             * bittrim
             * @param str:要去两头空格的字符串
             * @created  wangxiaotian
             * */
            $.bittrim = function (str) {
                return str.replace(/^\s*|\s*$/g, "");
            },
            /**
             * setHtmlTitle
             * @param str:title显示的字符串
             * @created  wangxiaotian
             * */
            $.setHtmlTitle = function (str) {
                var titleEl = document.getElementsByTagName('title')[0];
                if (titleEl) {
                    if (str) {
                        titleEl.innerHTML = str;
                    }
                }
            },
            /**
             * ParsingUrl
             * @param jsonurl:要解析的url
             * @param staticparams:解析的对象
             * @created  wangxiaotian
             * */
            $.ParsingUrl = function (jsonurl, staticparams) {
                var requestParams = jsonurl.match(/\$\{request\..+?\}/ig);
                if (requestParams && requestParams.length > 0) {
                    for (var key = 0; key < requestParams.length; key++) {
                        var _thisRequestParams = requestParams[key];
                        var _thisParamsKey = _thisRequestParams.split('${request.')[1].split('}')[0];
                        if (staticparams[_thisParamsKey]) {
                            jsonurl = jsonurl.replace(_thisRequestParams, staticparams[_thisParamsKey]);
                        }
                        else {
                            $.bitalerts.alert("\u65E0\u6CD5\u89E3\u6790\u9ED8\u8BA4\u503C:" + _thisParamsKey);
                        }
                    }
                }
                return jsonurl;
            },
            /**
             * isNoValid
             * @param val:验证的值
             * @created  wangxiaotian
             * */
            $.isNoValid = function (val) {
                if (val == null || val == undefined || val == '' || val == 'undefined' || JSON.stringify(val) == '{}') {
                    return true;
                }
                else {
                    try {
                        if (val && $.bittrim(val) == '') {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    catch (err) {
                        return false;
                    }
                }
            },
            /**
             * isLogin
             * @created  wangxiaotian
             * */
            $.isLogin = function () {
                if (!$.isNoValid(localstorage.getItem('token'))) {
                    return true;
                }
                else {
                    return false;
                }
            },
            /**
             * bitreplaceStr
             * @param str:要截取的字符串
             * @param startIndex:要替换的字符串的起始位置
             * @param endIndex:要替换的字符串的结束位置
             * @created  wangxiaotian
             * */
            $.bitreplaceStr = function (str, arr, replaceStr) {
                if (replaceStr === void 0) { replaceStr = ''; }
                if ($.isNoValid(str)) {
                    console.error("$.bitsubStr\u53C2\u6570" + str + "\u65E0\u6548;");
                    return false;
                }
                var start = arr[0] ? arr[0] : 0;
                var end = arr[1] ? arr[1] : str.length;
                if (typeof start == 'string') {
                    start = (str.indexOf(start) != -1) ? str.indexOf(start) + 1 : 0;
                }
                if (typeof end == 'string') {
                    end = (str.indexOf(end) != -1) ? str.indexOf(end) : str.length;
                }
                var strPre = str.substring(0, start <= end ? start : end);
                var strSuf = str.substring(end >= start ? end : start, str.length);
                return "" + strPre + replaceStr + strSuf;
            },
            /**
             * bitupload  目前仅支持单选以及可重复选取
             * @param resBack:返回处理后的图片 base64
             * @created  wangxiaotian
             * */
            $.bitupload = function (event, resBack) {
                if (event) {
                    $.bitloading.show('图片识别中');
                    var files = event.target.files, file = void 0, type_1, size = void 0;
                    var quality_1 = 1;
                    if (files && files.length > 0) {
                        file = files[0];
                        type_1 = file.type;
                        size = file.size;
                        size = +(size / 1024 / 1024).toFixed(2);
                        if (size > 5) {
                            quality_1 = +(5 / size).toFixed(2);
                        }
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            event.target.value = '';
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var image = new Image();
                            var base64Image = e.target.result;
                            image.src = base64Image;
                            image.onload = function () {
                                canvas.width = image.width;
                                canvas.height = image.height;
                                ctx.drawImage(image, 0, 0, image.width, image.height);
                                var img = canvas.toDataURL("" + type_1, quality_1);
                                eval(resBack.split('(')[0] + "('" + img + "')");
                            };
                        };
                    }
                }
                else {
                    $.bitalerts.alert('未获取到图片!');
                }
            },
            /**
             * bitimgView transform: translateX(0);
             * @created  wangxiaotian
             * */
            $.bitimgView = function (imgArr, index) {
                if (index === void 0) { index = 1; }
                if (!(imgArr instanceof Array)) {
                    console.error("$.bitimgView\u53C2\u6570imgArr:" + imgArr + "\u5E94\u4E3A\u4E00\u4E2A\u6570\u7EC4;");
                    return false;
                }
                if (index < 1) {
                    console.error("$.bitimgView\u53C2\u6570index\u6700\u5C0F\u503C\u4E3A1,\u5F53\u524D\u4F20\u5165\u7684\u503C\u4E3A" + index + ";");
                    return false;
                }
                if (index > imgArr.length) {
                    console.error("$.bitimgView\u53C2\u6570index:" + index + "\u5927\u4E8E\u4F20\u5165\u7684image\u603B\u6570" + imgArr.length + ";");
                    return false;
                }
                var imgDivHtml = '';
                imgArr.forEach(function (val) {
                    imgDivHtml += "<div class=\"img-div\">\n                                    " + (val['title'] ? ('<span class="gl-span">' + val['title'] + '</span>') : '') + "\n                                    <img src=\"" + val['url'] + "\">\n                                </div>";
                });
                var imgViewHtml = "<div class=\"bit-modal-background bit-imgview-modal bit-scale-in-animation\">\n                                <div class=\"bit-imgview-title\"><span class=\"bit-imgview-title-count\">" + index + "/" + imgArr.length + "</span><span class=\"bit-imgview-title-close\">\u5173\u95ED</span></div>\n                                <div class=\"bit-imgview-container\">\n                                    <div class=\"bit-imgview-div\">\n                                       " + imgDivHtml + "\n                                    </div>\n                                </div>\n                            </div>";
                $(imgViewHtml).appendTo('body');
                var indextransformArr = $('.bit-imgview-div').css('transform').split(',');
                var onetranslateX = +indextransformArr[4];
                indextransformArr[4] = "" + onetranslateX * (index - 1);
                $('.bit-imgview-div').css('transform', indextransformArr.join(','));
                //关闭
                $('.bit-imgview-title-close').on('tap click', function () {
                    $(this).off('tap click');
                    $('.bit-imgview-modal').remove();
                });
                //滑动
                var startX;
                var moveX;
                var movetransformArr;
                var movetranslateX;
                var moveNum = 0;
                $('.bit-imgview-div').on('touchstart', function (e) {
                    startX = e.targetTouches[0].pageX;
                    movetransformArr = $('.bit-imgview-div').css('transform').split(',');
                    movetranslateX = +movetransformArr[4];
                });
                $('.bit-imgview-div').on('touchmove', function (e) {
                    moveX = e.targetTouches[0].pageX;
                    moveNum = +(moveX - startX).toFixed(2);
                    movetransformArr[4] = "" + (movetranslateX + moveNum);
                    $('.bit-imgview-div').css('transform', movetransformArr.join(','));
                });
                $('.bit-imgview-div').on('touchend', function (e) {
                    var endtranslateX = +$('.bit-imgview-div').css('transform').split(',')[4];
                    if (endtranslateX >= 0) {
                        index = 1;
                        indextransformArr[4] = "" + onetranslateX * (index - 1);
                        $('.bit-imgview-div').css('transform', indextransformArr.join(','));
                        $('.bit-imgview-title-count').text(index + "/" + imgArr.length);
                    }
                    else if (endtranslateX < (onetranslateX * (imgArr.length - 1))) {
                        index = imgArr.length;
                        indextransformArr[4] = "" + onetranslateX * (index - 1);
                        $('.bit-imgview-div').css('transform', indextransformArr.join(','));
                        $('.bit-imgview-title-count').text(index + "/" + imgArr.length);
                    }
                    else {
                        if (moveNum <= -80) {
                            index = +parseInt((endtranslateX / onetranslateX) + '') + 2;
                        }
                        else if (moveNum >= 80) {
                            index = +parseInt((endtranslateX / onetranslateX) + '') + 1;
                        }
                        indextransformArr[4] = "" + onetranslateX * (index - 1);
                        $('.bit-imgview-div').css('transform', indextransformArr.join(','));
                        $('.bit-imgview-title-count').text(index + "/" + imgArr.length);
                    }
                });
            },
            /**
             * bitstorage
             * @param key:键
             * @param val:值
             * @param delArr:要移除的key的数组
             * @created  wangxiaotian
             * */
            $.bitstorage = {
                set: function (key, val) {
                    localstorage.setItem("" + key, "" + val);
                },
                get: function (key) {
                    if (localstorage.getItem(key)) {
                        var gVal = localstorage.getItem(key);
                        return gVal;
                    }
                    else {
                        return '';
                    }
                },
                clearAll: function () {
                    localstorage.clear();
                },
                clear: function (delArr) {
                    if (delArr === void 0) { delArr = []; }
                    if (delArr.length > 0) {
                        delArr.forEach(function (val) {
                            localstorage.remove(val);
                        });
                    }
                }
            },
            /**
             * bitalerts
             * @param str:显示的字符串
             * @param cancelBackFn:点击取消的回调函数
             * @param okBackFn:点击确定的回调函数
             * @param time:toast移除的时间
             * @created  wangxiaotian
             * */
            $.bitalerts = {
                alert: function (str, okBackFn) {
                    if (okBackFn === void 0) { okBackFn = function () { }; }
                    var alertLength = $('.bit-alerts-alert').length;
                    var alertHtml = "<div class=\"bit-alerts-modal bit-modal-background bit-alerts-alert  bit-scale-in-animation js-bit-alerts-alert-" + alertLength + "\">\n                            <div class=\"bit-alerts-container\">\n                                <div class=\"bit-alerts-header\">\n                                    <span>\u6E29\u99A8\u63D0\u793A</span>\n                                </div>\n                                <div class=\"bit-alerts-content scroll-y\">\n                                <span>" + str + "</span>\n                                </div>\n                                <div class=\"bit-alerts-footer\">\n                                    <a class=\"bit-button color-ok js-bit-alerts-alert-btn-ok-" + alertLength + "\" href=\"javascript:void(0)\">\u77E5\u9053\u4E86</a>\n                                </div>\n                            </div>\n                        </div>";
                    $(alertHtml).appendTo('body');
                    $(".js-bit-alerts-alert-btn-ok-" + alertLength).on('tap click', function () {
                        $(".js-bit-alerts-alert-" + alertLength).remove();
                        okBackFn();
                    });
                },
                confirm: function (str, okBackFn, cancelBackFn) {
                    if (okBackFn === void 0) { okBackFn = function () { }; }
                    if (cancelBackFn === void 0) { cancelBackFn = function () { }; }
                    var confirmHtml = "<div id=\"js-bit-alerts-confirm\" class=\"bit-alerts-modal bit-modal-background\">\n                            <div class=\"bit-alerts-container bit-scale-in-animation\">\n                                <div class=\"bit-alerts-header\">\n                                    <span>\u6E29\u99A8\u63D0\u793A</span>\n                                </div>\n                                <div class=\"bit-alerts-content scroll-y\">\n                                <span>" + str + "</span>\n                                </div>\n                                <div class=\"bit-alerts-footer\">\n                                    <a id=\"js-bit-alerts-confirm-btn-cancel\" class=\"bit-button color-cancel\" href=\"javascript:void(0)\">\u53D6\u6D88</a>\n                                    <span class=\"y-line\"></span>\n                                    <a id=\"js-bit-alerts-confirm-btn-ok\" class=\"bit-button color-ok\" href=\"javascript:void(0)\">\u786E\u5B9A</a>\n                                </div>\n                            </div>\n                        </div>";
                    $('#js-bit-alerts-confirm').remove();
                    $(confirmHtml).appendTo('body');
                    $('#js-bit-alerts-confirm-btn-cancel').on('tap click', function () {
                        $('#js-bit-alerts-confirm').remove();
                        cancelBackFn();
                    });
                    $('#js-bit-alerts-confirm-btn-ok').on('tap click', function () {
                        $('#js-bit-alerts-confirm').remove();
                        okBackFn();
                    });
                },
                toast: function (str, time) {
                    if (time === void 0) { time = 1500; }
                    var toastHtml = "<div class=\"bit-modal-background-transparent bit-alerts-toast js-bit-alerts-toast\">\n                                <div class=\"bit-toast-container\">\n                                    <div class=\"bit-toast-dv\">\n                                        " + str + "\n                                    </div>\n                                </div>\n                            </div>";
                    $(toastHtml).appendTo('body');
                    var toastTimer = setTimeout(function () {
                        $(".js-bit-alerts-toast")[0].remove();
                        clearTimeout(toastTimer);
                    }, time);
                }
            },
            /**
             * bitloading
             * @param str:显示的字符串
             * @created  wangxiaotian
             * */
            $.bitloading = {
                show: function (str) {
                    if (str === void 0) { str = '数据加载中,请稍后'; }
                    var loadingtHtml = "<div id=\"js-bit-loading\" class=\"bit-loading-modal bit-modal-background bit-scale-in-animation\">\n                                    <div class=\"bit-loading-container\">\n                                        <div class=\"bit-loading-icon\">\n                                            <img src=\"./imgs/loading.gif\">\n                                        </div>\n                                        <div class=\"bit-loading-text\">\n                                            <span>" + str + "</span>\n                                        </div>\n                                    </div>\n                                </div>";
                    if ($('#js-bit-loading')) {
                        $('#js-bit-loading').remove();
                    }
                    $(loadingtHtml).appendTo('body');
                },
                miss: function (str) {
                    if (str === void 0) { str = ''; }
                    if ($('#js-bit-loading')) {
                        $('#js-bit-loading').remove();
                    }
                }
            },
            /**
             * bithttp
             * @param httpUrl:get、post请求的url
             * @param postParam:post请求的传递参数
             * @param successBackFn:get、post请求成功的回调
             * @param errorBackFn:get、post请求失败的回调
             * @param option:get、post请求请求的配置 默认为同步请求
             * @created  wangxiaotian
             * */
            $.bithttp = {
                get: function (httpUrl, successBackFn, errorBackFn, option) {
                    if (successBackFn === void 0) { successBackFn = function () { }; }
                    if (errorBackFn === void 0) { errorBackFn = function () { }; }
                    if (option === void 0) { option = {}; }
                    var getUrl = '';
                    if (httpUrl.indexOf('http') == 0) {
                        getUrl = httpUrl;
                    }
                    else {
                        getUrl = "" + baseUrl + httpUrl;
                    }
                    var storageToken = $.bitstorage.get('token');
                    var headersObj = { 'AITTUSERTOKEN': "" + storageToken };
                    var ajaxDefaultOption = {
                        type: 'GET',
                        url: "" + getUrl,
                        async: false,
                        headers: headersObj,
                        timeout: 10000,
                        success: function (res) {
                            //没有登录、已过期 
                            if (res['type'] == 'nologin' || res['type'] == 'expire') {
                                $.bitstorage.clear(['token', 'grqch', 'grxh']);
                                $.bitalerts.confirm(res['content'], function () {
                                    goLogin();
                                });
                                return false;
                            }
                            //返回的数据是null、undefined
                            if ($.isNoValid(res['content'])) {
                                $.bitalerts.alert('返回的数据格式不正确!');
                                return false;
                            }
                            //返回的type!=success
                            if (res['type'] != 'success' && res['type'] != 'warn') {
                                $.bitalerts.alert(res['content']);
                                errorBackFn(res);
                                return false;
                            }
                            //返回的type==success
                            if (res['type'] == 'success' || res['type'] == 'warn') {
                                successBackFn(res);
                            }
                        },
                        error: function (err) {
                            $.bitloading.miss();
                            if (err.status && err.status == 401) {
                                $.bitstorage.clear(['token', 'grqch', 'grxh']);
                                $.bitalerts.confirm('未登录或已过期,重新登录?', function () {
                                    goLogin();
                                });
                            }
                            else {
                                $.bitalerts.alert('未知错误!');
                            }
                        }
                    };
                    var ajaxOption = Object.assign(ajaxDefaultOption, option);
                    try {
                        $.ajax(ajaxOption);
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                post: function (httpUrl, postParam, successBackFn, errorBackFn, option) {
                    if (postParam === void 0) { postParam = {}; }
                    if (successBackFn === void 0) { successBackFn = function () { }; }
                    if (errorBackFn === void 0) { errorBackFn = function () { }; }
                    if (option === void 0) { option = {}; }
                    var postUrl = '';
                    if (httpUrl.indexOf('http') == 0) {
                        postUrl = httpUrl;
                    }
                    else {
                        postUrl = "" + baseUrl + httpUrl;
                    }
                    var storageToken = $.bitstorage.get('token');
                    var headersObj = { 'AITTUSERTOKEN': "" + storageToken };
                    if (!$.isNoValid(postParam['hdxh'])) {
                        headersObj['_YWXH'] = "" + postParam['hdxh'];
                    }
                    var ajaxDefaultOption = {
                        type: 'POST',
                        url: "" + postUrl,
                        async: false,
                        timeout: 10000,
                        contentType: 'application/json;charset=UTF-8',
                        dataType: 'json',
                        headers: headersObj,
                        data: JSON.stringify(postParam),
                        success: function (res) {
                            //没有登录、已过期 
                            if (res['type'] == 'nologin' || res['type'] == 'expire') {
                                $.bitstorage.clear(['token', 'grqch', 'grxh']);
                                $.bitalerts.confirm(res['content'], function () {
                                    goLogin();
                                });
                                return false;
                            }
                            //返回的数据是null、undefined
                            if ($.isNoValid(res['content'])) {
                                $.bitalerts.alert('返回的数据格式不正确!');
                                return false;
                            }
                            //返回的type!=success
                            if (res['type'] != 'success' && res['type'] != 'warn') {
                                $.bitalerts.alert(res['content']);
                                errorBackFn(res);
                                return false;
                            }
                            //返回的type==success
                            if (res['type'] == 'success' || res['type'] == 'warn') {
                                successBackFn(res);
                            }
                        },
                        error: function (err) {
                            $.bitloading.miss();
                            if (err.status && err.status == 401) {
                                $.bitstorage.clear(['token', 'grqch', 'grxh']);
                                $.bitalerts.confirm('未登录或已过期,重新登录?', function () {
                                    goLogin();
                                });
                            }
                            else {
                                $.bitalerts.alert('未知错误!');
                            }
                        }
                    };
                    var ajaxOption = Object.assign(ajaxDefaultOption, option);
                    try {
                        $.ajax(ajaxOption);
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            };
    })($);
}
