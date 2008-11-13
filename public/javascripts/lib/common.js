//=============================
// 数値、金額のカンマ編集
//=============================
function money_format(num) {
    // カンマ編集
    num = String( num );
    num.match( /(\d+)(\.\d+)*/ );
    num = RegExp.$1;
    var frac = RegExp.$2;
    switch (frac.length){
    case 0:
        frac = "";
        break;
    case 2:
        frac += "0";
        break;
    default:
    }
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    num = frac ? num + frac : num;
    return num;
}

/**
 * [関数名] ZeroFormat
 * [機　能] ゼロ埋め
 * [説　明] 数値が指定した桁数になるまで数値の先頭をゼロで埋める
 * 
 * @param  integer num    数値
 * @param  integer max    桁数
 * @return integer tmpS   ゼロ埋め後の数値
*/
function ZeroFormat(num,max){
    var tmp=''+num;
    while(tmp.length<max){
        tmp='0'+tmp;
    }
    return tmp;
}

/*==================================================
 * 関数名：fncValidDate
 * 概　要：日付文字列が日付として正当かチェックする
 * 引　数：str           String      日付文字列
 * 戻り値：bool
==================================================*/
function fncValidDate(str){
    var dateFormat = new DateFormat("yyyy-MM-dd");
    var date = dateFormat.parse(str);
    if (!date) {
        var dateFormat = new DateFormat("yyyy/MM/dd");
        var date = dateFormat.parse(str);
    }
    if (!date) {
        return false;
    }
    return true;
}

function onDateChange(date) {
    if (!date) {
        return '';
    }

    //現在日付を取得する
    var dd = new Date();
    var yy = dd.getYear();
    var mm = dd.getMonth() + 1;
    var td = dd.getDate();
    var yd = td - 1;
    if (yy < 2000) { yy += 1900; }
    if (mm < 10) { mm = "0" + mm; }
    if (td < 10) { td = "0" + td; }
    if (yd < 10) { yd = "0" + yd; }
    //年YYYY
    var year = yy;
    //月日MM-DD(今日)
    var today = mm + '/' + td;
    //月日MM-DD(昨日)
    var yesterday = mm + '/' + yd;

    //判断する
    var rtn = '';
    var rtn_y =    date.substr(0,4) ? date.substr(0,4) : ''; // 年
    var rtn_d =    date.substr(5,5) ? date.substr(5,5) : ''; // 日
    var rtn_t = date.substr(11,5) ? date.substr(11,5) : ''; // 時間
    //年
    if ( rtn_y == year ) {
        rtn_y = '';

        //日
        if (rtn_d == today) {
            rtn_d = '今日';
        } else if (rtn_d == yesterday) {
            rtn_d = '昨日';
        }
        
        rtn = rtn_d + ' ' + rtn_t;
    } else {
        rtn = rtn_y.substr(2,2) + '/' + rtn_d + ' ' + rtn_t;
    }

    return rtn;

}

/*==================================================
 * 関数名：fncBackToForth
 * 概　要：二つの日付文字列前後をチェックする
 * 引　数：forthdate     String      前日付文字列
 *       ：backdate      String      後日付文字列
 * 戻り値：bool
 ==================================================*/
function fncBackToForth(forthdate, backdate){
    var dateFormat = new DateFormat("yyyy-MM-dd");
    var f_date = dateFormat.parse(forthdate);
    if (!f_date) {
        var dateFormat = new DateFormat("yyyy/MM/dd");
        var f_date = dateFormat.parse(forthdate);
    }
    if (!f_date) {
        return false;
    }
    var dateFormat = new DateFormat("yyyy-MM-dd");
    var b_date = dateFormat.parse(backdate);
    if (!b_date) {
        var dateFormat = new DateFormat("yyyy/MM/dd");
        var b_date = dateFormat.parse(backdate);
    }
    if (!b_date) {
        return false;
    }
    if (f_date > b_date) {
        return false;
    }
    return true;
}

/*
--------------------------------------------------------
dateformat.js - Simple date formatter
Version 1.1 (Update 2008/04/02)

Copyright (c) 2007-2008 onozaty (http://www.enjoyxstudy.com)

Released under an MIT-style license.

For details, see the web site:
 http://www.enjoyxstudy.com/javascript/dateformat/

--------------------------------------------------------
patterns
y : Year         ex. "yyyy" -> "2007", "yy" -> "07"
M : Month        ex. "MM" -> "05" "12", "M" -> "5" "12"
d : Day          ex. "dd" -> "09" "30", "d" -> "9" "30"
H : Hour (0-23)  ex. "HH" -> "00" "23", "H" -> "0" "23"
m : Minute       ex. "mm" -> "01" "59", "m" -> "1" "59"
s : Second       ex. "ss" -> "00" "59", "H" -> "0" "59"
S : Millisecond  ex. "SSS" -> "000" "012" "999", 
                     "SS" -> "00" "12" "999", "S" -> "0" "12" "999"

Text can be quoted using single quotes (') to avoid interpretation.
"''" represents a single quote. 


Useing..

 var fmt = new DateFormat("yyyy/MM/dd HH:mm:ss SSS");

 var str = fmt.format(new Date()); // "2007/05/10 12:21:19 002"
 var date = fmt.parse("2007/05/10 12:21:19 002"); // return Date object

--------------------------------------------------------
*/

var DateFormat = function(pattern) {
  this._init(pattern);
};

DateFormat.prototype = {
  _init: function(pattern) {

    this.pattern = pattern;
    this._patterns = [];

    for (var i = 0; i < pattern.length; i++) {
      var ch = pattern.charAt(i);
      if (this._patterns.length == 0) {
        this._patterns[0] = ch;
      } else {
        var index = this._patterns.length - 1;
        if (this._patterns[index].charAt(0) == "'") {
          if (this._patterns[index].length == 1 
             || this._patterns[index].charAt(this._patterns[index].length - 1) != "'") {
            this._patterns[index] += ch;
          } else {
            this._patterns[index + 1] = ch;
          }
        } else if (this._patterns[index].charAt(0) == ch) {
          this._patterns[index] += ch;
        } else {
          this._patterns[index + 1] = ch;
        }
      }
    }
  },

  format: function(date) {

    var result = [];
    for (var i = 0; i < this._patterns.length; i++) {
      result[i] = this._formatWord(date, this._patterns[i]);
    }
    return result.join('');
  },
  _formatWord: function(date, pattern) {

    var formatter = this._formatter[pattern.charAt(0)];
    if (formatter) {
      return formatter.apply(this, [date, pattern]);
    } else {
      return pattern;
    }
  },
  _formatter: {
    "y": function(date, pattern) {
      // Year
      var year = String(date.getFullYear());
      if (pattern.length <= 2) {
        year = year.substring(2, 4);
      } else {
        year = this._zeroPadding(year, pattern.length);
      }
      return year;
    },
    "M": function(date, pattern) {
      // Month in year
      return this._zeroPadding(String(date.getMonth() + 1), pattern.length);
    },
    "d": function(date, pattern) {
      // Day in month
      return this._zeroPadding(String(date.getDate()), pattern.length);
    },
    "H": function(date, pattern) {
      // Hour in day (0-23)
      return this._zeroPadding(String(date.getHours()), pattern.length);
    },
    "m": function(date, pattern) {
      // Minute in hour
      return this._zeroPadding(String(date.getMinutes()), pattern.length);
    },
    "s": function(date, pattern) {
      // Second in minute
      return this._zeroPadding(String(date.getSeconds()), pattern.length);
    },
    "S": function(date, pattern) {
      // Millisecond
      return this._zeroPadding(String(date.getMilliseconds()), pattern.length);
    },
    "'": function(date, pattern) {
      // escape
      if (pattern == "''") {
        return "'";
      } else {
        return pattern.replace(/'/g, '');
      }
    }
  },

  _zeroPadding: function(str, length) {
    if (str.length >= length) {
      return str;
    }

    return new Array(length - str.length + 1).join("0") + str;
  },


  /// Parser ///
  parse: function(text) {

    if (typeof text != 'string' || text == '') return null;

    var result = {year: 1970, month: 1, day: 1, hour: 0, min: 0, sec: 0, msec: 0};

    for (var i = 0; i < this._patterns.length; i++) {
       if (text == '') return null; // parse error!!
       text = this._parseWord(text, this._patterns[i], result);
       if (text === null) return null; // parse error!!
    }
    if (text != '') return null; // parse error!!

    return new Date(
                result.year,
                result.month - 1,
                result.day,
                result.hour,
                result.min,
                result.sec,
                result.msec);
  },
  _parseWord: function(text, pattern, result) {

    var parser = this._parser[pattern.charAt(0)];
    if (parser) {
      return parser.apply(this, [text, pattern, result]);
    } else {
      if (text.indexOf(pattern) != 0) {
        return null;
      } else {
        return text.substring(pattern.length);
      }
    }
  },
  _parser: {
    "y": function(text, pattern, result) {
      // Year
      var year;
      if (pattern.length <= 2) {
        year = text.substring(0, 2);
        year = year < 70 ? '20' + year : '19' + year;
        text = text.substring(2);
      } else {
        var length = (pattern.length == 3) ? 4 : pattern.length;
        year = text.substring(0, length);
        text = text.substring(length);
      }
      if (!this._isNumber(year)) return null; // error
      result.year = parseInt(year, 10);
      return text;
    },
    "M": function(text, pattern, result) {
      // Month in year
      var month;
      if (pattern.length == 1 && text.length > 1
          && text.substring(0, 2).match(/1[0-2]/) != null) {
        month = text.substring(0, 2);
        text  = text.substring(2);
      } else {
        month = text.substring(0, pattern.length);
        text  = text.substring(pattern.length);
      }
      if (!this._isNumber(month)) return null; // error
      result.month = parseInt(month, 10);
      return text;
    },
    "d": function(text, pattern, result) {
      // Day in month
      var day;
      if (pattern.length == 1 && text.length > 1 
          && text.substring(0, 2).match(/1[0-9]|2[0-9]|3[0-1]/) != null) {
        day  = text.substring(0, 2);
        text = text.substring(2);
      } else {
        day  = text.substring(0, pattern.length);
        text = text.substring(pattern.length);
      }
      if (!this._isNumber(day)) return null; // error
      result.day = parseInt(day, 10);
      return text;
    },
    "H": function(text, pattern, result) {
      // Hour in day (0-23)
      var hour;
      if (pattern.length == 1 && text.length > 1
          && text.substring(0, 2).match(/1[0-9]|2[0-3]/) != null) {
        hour = text.substring(0, 2);
        text = text.substring(2);
      } else {
        hour = text.substring(0, pattern.length);
        text = text.substring(pattern.length);
      }
      if (!this._isNumber(hour)) return null; // error
      result.hour = parseInt(hour, 10);
      return text;
    },
    "m": function(text, pattern, result) {
      // Minute in hour
      var min;
      if (pattern.length == 1 && text.length > 1
          && text.substring(0, 2).match(/[1-5][0-9]/) != null) {
        min  = text.substring(0, 2);
        text = text.substring(2);
      } else {
        min  = text.substring(0, pattern.length);
        text = text.substring(pattern.length);
      }
      if (!this._isNumber(min)) return null; // error
      result.min = parseInt(min, 10);
      return text;
    },
    "s": function(text, pattern, result) {
      // Second in minute
      var sec;
      if (pattern.length == 1 && text.length > 1
          && text.substring(0, 2).match(/[1-5][0-9]/) != null) {
        sec  = text.substring(0, 2);
        text = text.substring(2);
      } else {
        sec  = text.substring(0, pattern.length);
        text = text.substring(pattern.length);
      }
      if (!this._isNumber(sec)) return null; // error
      result.sec = parseInt(sec, 10);
      return text;
    },
    "S": function(text, pattern, result) {
      // Millimsecond
      var msec;
      if (pattern.length == 1 || pattern.length == 2) {
        if (text.length > 2 && text.substring(0, 3).match(/[1-9][0-9][0-9]/) != null) {
          msec = text.substring(0, 3);
          text = text.substring(3);
        } else if (text.length > 1 && text.substring(0, 2).match(/[1-9][0-9]/) != null) {
          msec = text.substring(0, 2);
          text = text.substring(2);
        } else {
          msec = text.substring(0, pattern.length);
          text = text.substring(pattern.length);
        }
      } else {
        msec = text.substring(0, pattern.length);
        text = text.substring(pattern.length);
      }
      if (!this._isNumber(msec)) return null; // error
      result.msec = parseInt(msec, 10);
      return text;
    },
    "'": function(text, pattern, result) {
      // escape
      if (pattern == "''") {
        pattern = "'";
      } else {
        pattern = pattern.replace(/'/g, '');
      }
      if (text.indexOf(pattern) != 0) {
        return null; // error
      } else {
        return text.substring(pattern.length);
      }
    }
  },

  _isNumber: function(str) {
    return /^[0-9]*$/.test(str);
  }
}

// 入力フォーム用
function invalid_alert(f, msg){
    alert(msg);
    f.focus();
    return false;
}

function set_invalid_event(obj){
    obj.on( 'invalid', invalid_alert, this );
}