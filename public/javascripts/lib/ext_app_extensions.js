Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            var value = record.data[this.dataIndex]===true || record.data[this.dataIndex] === 1 || record.data[this.dataIndex] ==="1" ? 2 : 1 ;
            record.set(this.dataIndex, value);
        }
    },

    renderer : function(v, p, record, row, cell, store){
        if( this.allowRenderer ){
            if( !this.allowRenderer.call(this, v, p, record, row, cell, store) ) return "" ;
        }
        
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v===true||v===1||v==="1"?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};


Ext.form.ComboBoxEx = Ext.extend(Ext.form.ComboBox, {
    initComponent : function(){
        Ext.form.ComboBoxEx.superclass.initComponent.call(this);
        var width = this.el.getStyle("width") ;
        if( width ){
            this.wrap.setStyle("width", width ) ;            
        }
    },

    initList : function(){
        if(!this.list){
            var cls = 'x-combo-list';

            this.list = new Ext.Layer({
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
            });

            var lw = this.listWidth || Math.max( (this.el.getWidth()+this.trigger.getWidth()), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;

            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.on('mouseover', this.onViewOver, this);
            this.innerList.on('mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(this.pageSize){
                this.footer = this.list.createChild({cls:cls+'-ft'});
                this.pageTb = new Ext.PagingToolbar({
                    store:this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            if(!this.tpl){
			    
                this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
            }

		    
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item'
            });

            this.view.on('click', this.onViewClick, this);

            this.bindStore(this.store, true);

            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.resizer.on('resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
    }
    
});

Ext.form.HtmlEditorEx = Ext.extend(Ext.form.HtmlEditor, {
    createLink : function(){
        // IEの場合、プロンプトウィンドウを表示すると選択状態が消えるため、ここで選択状態を保存
        if (Ext.isIE) {
            this.win.focus();
            this.__selrange = this.doc.selection.createRange();
        }
        
        Ext.MessageBox.show( {
            animEl : this.iframe,
            title: 'リンク生成',
            msg: 'リンク先のURLを入力してください。',
            prompt: true,
            value: this.defaultLinkValue,
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function(btn, url){
                if (Ext.isIE) {
                    if( this.__selrange != null){
                        // IEの場合、プロンプトウィンドウを表示すると選択状態が消えるため、ここで選択状態を再設定
                        this.win.focus();
                        this.__selrange.select() ;
                    }
                }                

                if (btn != 'ok') 
                    return;
                
                if (url && url != 'http:/' + '/') {
                    this.relayCmd('createlink', url);
                }
            }.createDelegate(this)
        } );
    }
}) ;

Ext.DatePickerEx = Ext.extend(Ext.DatePicker, {
    cls  : 'app-DatePicker',
    
    selectType : 'monthly',  // 'monthly' or 'weekly' or 'dayly' 
    
    monthlySelRangeBack : 2, // week
    monthlySelRangeFowrd : 3, // week
    
    activeDateStart : null,
    activeDateEnd : null,
    date_list : {},// list of date


    setSelectType : function( type ){
        this.selectType = type ;
        this.update(this.value);
    },

    updateActiveDate : function(){
        seldate = this.getValue() ;
        var activestart ;
        var activeend ;
        
        switch( this.selectType ){
            case 'monthly' :
                activestart = seldate.add(Date.DAY, -(this.monthlySelRangeBack*7)-seldate.getDay()) ;
                activeend = seldate.add(Date.DAY, (this.monthlySelRangeFowrd*7)+(6-seldate.getDay())) ;
                break ;
            case 'weekly' :
                activestart = seldate.add(Date.DAY, -seldate.getDay()) ;
                activeend = seldate.add(Date.DAY, (6-seldate.getDay())) ;
                break ;
            case 'dayly' :
                activestart = seldate ;
                activeend = seldate ;
                break ;
        }
        this.activeDateStart = activestart ;
        this.activeDateEnd = activeend ;
    },
        
    update: function(date){
//        Ext.app.DatePicker.superclass.update.call(this, date);
        var vd = this.activeDate;
        this.activeDate = date;

        this.updateActiveDate() ;
        var activestart = this.activeDateStart ;
        var activeend = this.activeDateEnd ;

        if(vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
                       setTimeout(function(){
                            try{c.dom.firstChild.focus();}catch(e){}
                       }, 50);
                       return false;
                   }
                });

                this.cells.removeClass("app-date-active-range");
                this.cells.each(function(c){
                   var curdate = new Date() ;
                   curdate.setTime( c.dom.firstChild.dateValue ) ;
                   if(curdate.between(activestart, activeend)){
                       c.addClass("app-date-active-range");
                   }
                });

                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;
        
        this.date_list = {};
        
        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
            if(activestart && activeend){
                if(d.between(activestart, activeend)){
                    cell.className += " app-date-active-range";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
            this.date_list[d.format('Y-m-d')] = cells[i];
        }
        for(; i < days; i++){
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
            this.date_list[d.format('Y-m-d')] = cells[i];
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
             this.date_list[d.format('Y-m-d')] = cells[i];
        }

        this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Ext.fly(main).setWidth(w);
            this.internalRender = true;
            
            
            
            if(Ext.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
    }    
}) ;

// private
Date.createParser = function(format) {
  var funcName = "parse" + Date.parseFunctions.count++;
  var regexNum = Date.parseRegexes.length;
  var currentGroup = 1;
  Date.parseFunctions[format] = funcName;

  var code = "Date." + funcName + " = function(input){\n"
      + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, ms = -1, o, z, u, v;\n"
      + "input = String(input);var d = new Date();\n"
      + "y = d.getFullYear();\n"
      + "m = d.getMonth();\n"
      + "d = d.getDate();\n"
      + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
      + "if (results && results.length > 0) {";
  var regex = "";

  var special = false;
  var ch = '';
  for (var i = 0; i < format.length; ++i) {
      ch = format.charAt(i);
      if (!special && ch == "\\") {
          special = true;
      }
      else if (special) {
          special = false;
          regex += String.escape(ch);
      }
      else {
          var obj = Date.formatCodeToRegex(ch, currentGroup);
          currentGroup += obj.g;
          regex += obj.s;
          if (obj.g && obj.c) {
              code += obj.c;
          }
      }
  }

  code += "if (u){\n"
      + "v = new Date(u * 1000);\n" // give top priority to UNIX time
      + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0){\n"
      + "v = new Date(y, m, d, h, i, s, ms);\n"
      + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0){\n"
      + "v = new Date(y, m, d, h, i, s);\n"
      + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0){\n"
      + "v = new Date(y, m, d, h, i);\n"
      + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0){\n"
      + "v = new Date(y, m, d, h);\n"
      + "}else if (y >= 0 && m >= 0 && d > 0){\n"
      + "v = new Date(y, m, d);\n"
      + "}else if (y >= 0 && m >= 0){\n"
      + "v = new Date(y, m);\n"
      + "}else if (y >= 0){\n"
      + "v = new Date(y);\n"
      + "}\n}\nreturn (v && (z || o))?" // favour UTC offset over GMT offset
      +     " (Ext.type(z) == 'number' ? v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - z) :" // reset to UTC, then add offset
      +         " v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn))) : v;\n" // reset to GMT, then add offset
      + "}";

  Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
  eval(code);
};

// private
Ext.apply(Date.parseCodes, {
    j: {
        g:1,
        c:"d = parseInt(results[{0}], 10);\n",
        s:"(\\d{1,2})" // day of month without leading zeroes (1 - 31)
    },
    M: function() {
        for (var a = [], i = 0; i < 12; a.push(Date.getShortMonthName(i)), ++i); // get localised short month names
        return Ext.applyIf({
            s:"(" + a.join("|") + ")"
        }, Date.formatCodeToRegex("F"));
    },
    n: {
        g:1,
        c:"m = parseInt(results[{0}], 10) - 1;\n",
        s:"(\\d{1,2})" // month number without leading zeros (1 - 12)
    },
    o: function() {
        return Date.formatCodeToRegex("Y");
    },
    g: function() {
        return Date.formatCodeToRegex("G");
    },
    h: function() {
        return Date.formatCodeToRegex("H");
    },
    P: {
      g:1,
      c:[
          "o = results[{0}];",
          "var sn = o.substring(0,1);", // get + / - sign
          "var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);", // get hours (performs minutes-to-hour conversion also, just in case)
          "var mn = o.substring(4,6) % 60;", // get minutes
          "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
      ].join("\n"),
      s: "([+\-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (with colon separator)
    }
});

// private
Date.formatCodeToRegex = function(character, currentGroup) {
    // Note: currentGroup - position in regex result array (see notes for Date.parseCodes above)
    var p = Date.parseCodes[character];

    if (p) {
      p = Ext.type(p) == 'function'? p() : p;
      Date.parseCodes[character] = p; // reassign function result to prevent repeated execution      
    }

    return p? Ext.applyIf({
      c: p.c? String.format(p.c, currentGroup || "{0}") : p.c
    }, p) : {
        g:0,
        c:null,
        s:Ext.escapeRe(character) // treat unrecognised characters as literals
    }
};

Date.prototype.getGMTOffset = function(colon) {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
        + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0")
        + (colon ? ":" : "")
        + String.leftPad(Math.abs(this.getTimezoneOffset() % 60), 2, "0");
};

