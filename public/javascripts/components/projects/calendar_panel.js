;(function() {

    $mo.namespace('components.projects.calendar_panel');
    components.projects.calendar_panel = function() {
        this.initialize();
    };
    components.projects.calendar_panel.prototype = {
        bars: {},
        days_y: {},
        layout_flg: 0,

        initialize: function() {
            this.set_signals();
            this.init_events();
            this.init_layout();
            this.load_data();
        },

        set_signals: function() {
            $mo.connect('load', this.load_list, this);
            // task
            $mo.connect('saved_projects_task_edit_dialog', this.load_data, this);
            $mo.connect('deleted_projects_task_edit_dialog', this.load_data, this);
            //milestone
            $mo.connect('saved_projects_milestone_edit_dialog', this.load_data, this);
            $mo.connect('deleted_projects_milestone_edit_dialog', this.load_data, this);
            //event
            $mo.connect('saved_projects_event_edit_dialog', this.load_data, this);
            $mo.connect('deleted_projects_event_edit_dialog', this.load_data, this);
        },

        init_events: function() {
            $(window).resize($mo.scope(this, this.resetCalendar));
        },
        init_layout: function() {

            // Ext tooltip
            Ext.QuickTips.init();
            Ext.QuickTips.enable();

            var header  = $('#calendar_dataGridHeader');
            var content = $('#calendar_dataGridContent');
            var size = this._getWrapperSize();
            // alert(size.width + ', ' + size.height);
            header.css({
                //width: (size.width  ) + 'px'
                //height: size.height + 'px'
            });
            content.css({
                height: (size.height - 24) + 'px'
            });
            var cal_header = $('#calendar_header');
            var cal_body   = $('#calendar_body');
            var td_w = ((size.width - 17) / 7) - 1;
            $('thead tr th', cal_header).each(function() {
                $(this).css({width:td_w+'px'});
            });
            $('td', $('tbody tr', cal_body).get(0)).each(function() {
                $(this).css({width:td_w+'px'});
            });
            this.day_width = td_w;
            header.show();
            content.show();
        },


        load_data: function() {
		    var p_cd = Ext.get('current_project_project_cd').dom.value;
            var url = url_for('projects/'+p_cd+'/calendar.json');
            $.get(url, null, $mo.scope(this, this.loadedData)); 
        },
        loadedData: function(r) {
            r = eval('(' + r + ')');
            this.items = r.items;
            this.project = r.project;
            if (this.items.length > 0) {
                this.layout_flg = 0;
                this.clearBars();
                this.buildBars();
            }
        },

        resetCalendar: function() {
            this.layout_flg = 0;
            this.init_layout();
            this.clearBars();
            this.buildBars();
        },

        clearBars: function() {
            $('div.calendar_base_bar').each(function() {
                $(this).remove();
            });
        },

        buildBars: function() {
            if (this.items.length <= 0) {
                return false;
            }
            var items = this.items;
            this.container = $('#calendar_dataGridContentBars');
            this.days      = {};
            this.days_y    = {};
            this.base_position = this.container.position();
            
            var length = items.length;
            for (var i=0; i<length; i++) {
                var item = items[i]
                this.buildBar(item);
            }

            if (this.layout_flg == 1) {
                this.clearBars();
                this.layout_flg = 2;
                this.buildBars();
            }

        },

        buildBar: function(item) {
            var kbn = item.kbn;
            if (item.start_date > this.project.delivery_date || item.end_date < this.project.start_date){
                return false;
            }
            if (item.start_date < this.project.delivery_date && item.end_date > this.project.delivery_date){
                item.end_date = this.project.delivery_date;
            }
            if (item.end_date > this.project.start_date && item.start_date < this.project.start_date){
                item.start_date = this.project.start_date;
            }

            switch (kbn) {
            case 'event':
            case 'milestone':
                this._buildOnedayBar(item);
                break;
            case 'task':
            default:
                this._buildSomedayBar(item);
                break;
            }
        },


        _bindBarEvent: function(item, bar) {
            var kbn = item.kbn;
            switch (kbn) {
            case 'event':
                var dblclick = 'open_projects_event_edit_dialog';
                break;
            case 'milestone':
                var dblclick = 'open_projects_milestone_edit_dialog';
                break;
            case 'task':
                var dblclick = 'open_projects_task_edit_dialog';
                break;
            default:
                break;
            }
            var comp_id = item.id;
            $(bar).dblclick($mo.callback(dblclick, {comp_id: comp_id}));
        },

        _buildTooltip: function(item, bar) {
            var $ef = Ext.util.Format;
            var kbn = item.kbn;
            switch (kbn) {
            case 'event':
                var template = '<span style="font-weight:bold;">{0}</span><br>';
                var tipstext = String.format(template, $ef.htmlEncode(item.item_name));
                break;
            case 'milestone':
                var template = '<span style="font-weight:bold;">{0}</span><br>{1}';
                var tipstext = String.format(template, $ef.htmlEncode(item.item_name), item.start_date);
                break;
            case 'task':
            default:
                var template = '<span style="font-weight:bold;">{0}</span><br>{1}～{2}';
                var tipstext = String.format(template, $ef.htmlEncode(item.item_name), item.start_date, item.end_date);
                break;
            }
            Ext.QuickTips.register({target:bar, text:tipstext});
        },


        _buildOnedayBar: function(item) {
            var kbn = item.kbn;
            var start_date  = item.start_date;
            var end_date    = item.end_date;
            var target_date = start_date.split('-').join('');
            var target_cell = this._getTargetCell(target_date);
            var pos = this._getBarPosition(target_cell);
            var container = this._getDateContainer(target_date);
            var base = this._buildBarBase();
            var bar = document.createElement('div');
            base.css({width:this.day_width});
            var bar = document.createElement('div');
            $(bar).css({
                'background'   : 'url('+url_for('images/icon/'+kbn+'.gif')+') no-repeat left center',
                'line-height'  : '20px',
                'height'       : '20px',
                'padding-left' : '15px',
                'margin-left'  : '3px',
                'cursor'       : 'pointer'
            });
            $(bar).append(item.item_name);
            base.append(bar);
            container.append(base);

            this._bindBarEvent(item, bar); // event
            this._buildTooltip(item, bar); // tooltip
            base.css({top:(pos.y + this.days_y[target_date]*21)+'px', left:pos.x+'px'});

            return base;
        },

        _buildSomedayBar: function(item) {
            var start_date  = item.start_date;
            var end_date    = item.end_date;

            var i = 0;
            var s = parseInt(start_date.split('-').join(''));
            var e = parseInt(end_date.split('-').join(''));
            var is_new = true;
            var through_last = false;
            for (var d=s; d<=e; d++) {
                var day_cell = $('#calendar_day_'+d);
                if (day_cell.length > 0) {
                    if (is_new == true) {
                        is_new = false;
                        var target_cell = this._getTargetCell(d);
                        var pos  = this._getBarPosition(target_cell);
                        var base = this._buildBarBase();
                        var bar  = document.createElement('div');
                        
                        $(bar).css({
                            'padding-left': '8px',
                            'line-height':'20px',
                            'height':'20px',
                            'font-size':'11px',
                            'background-image':'url('+url_for('images/etc/bar_calendar_center.gif')+')',
                            'cursor': 'pointer'
                        });
                        if (s == d) {
                            base.css({
                                'background-image':'url('+url_for('images/etc/bar_calendar_left.gif')+')',
                                'background-repeat':'no-repeat'
                            });
                            $(bar).css({
                                'margin-left': '5px'
                            });
                        }
                        var container = this._getDateContainer(d);
                    } else {
                        var _container = this._getDateContainer(d);
                        var dummy_bar  = document.createElement('div');
                        dummy_bar.innerHTML = '<div style="height:21px;">&nbsp;</div>';
                        _container.append(dummy_bar);
                    }
                    i++;
                    var classes = day_cell.attr('class');
                    if (classes.indexOf('last') >= 0) through_last = true;
                    if (classes.indexOf('last') >= 0 || d == e) {
                        base.css({width:((this.day_width + 2) * i)});
                        
                        var item_name = document.createElement('span');
                        $(item_name)
                        //.css({'background-image':'url('+url_for('images/icon/task.gif')+')', 'padding-left':'15px'})
                        .html(item.item_name);
                        $(bar).append(item_name);
                        if (d == e) {
                            $(bar).css({'margin-right':'5px'});
                            var right_end = document.createElement('div');
                            $(right_end)
                            .css({
                                'height':'20px',
                                'background-repeat':'no-repeat',
                                'background-image':'url('+url_for('images/etc/bar_calendar_right.gif')+')',
                                'background-position': 'right center'
                            })
                            .html('');
                            $(right_end).append(bar);
                            base.append(right_end);
                        } else {
                            base.append(bar);
                        }
                        this._bindBarEvent(item, bar); // event
                        this._buildTooltip(item, bar); // tooltip
                        container.append(base);

                        base.css({top:(pos.y + this.days_y[d]*21)+'px', left:pos.x+'px'});
                        
                        i = 0;
                        is_new = true;
                    }
                }
            }
        },

        _getTargetCell: function(date) {
            var cell = $('#calendar_day_' + date);
            return cell;
        },

        _getDateContainer: function(date) {
            if (!this.days[date]) {
                var div = document.createElement('div');
                var day = $(div);
                day.css({height:'0px'});
                this.days[date]   = day;
                this.days_y[date] = 0;
            } else {
                this.days_y[date] += 1;
            }

            if (this.days_y[date] > 3){
                var elm = Ext.get('calendar_day_' + date);
                elm.setHeight(110 + 21*(this.days_y[date] - 3));
                if (this.layout_flg != 2) this.layout_flg = 1;
            }

            this.container.append(div);
            return this.days[date];
        },

        _buildBarBase: function() {
            var base = $(document.createElement('div'));
            var css = {
                'position': 'absolute',
                'top': '0px',
                'left': '0px',
                'height': '21px',
                'overflow': 'hidden'
            };
            base.css(css).addClass('calendar_base_bar');
            return base
        },

        _getBarPosition: function(target_cell) {
            var base_pos = this.base_position;
            var cell_pos = target_cell.position();
            
            return {
                x: cell_pos.left - base_pos.left,
                y: cell_pos.top - base_pos.top + 20
            };
        },


        _getWrapperSize: function() {
            var header   = $('#calendar_dataGridHeader');
            var wrapper  = $('#calendar_panel_wrapper');
            var margin_x = parseInt(wrapper.css('padding-left').replace('px', ''))
                                + parseInt(wrapper.css('padding-right').replace('px', ''));
            var margin_y = parseInt(wrapper.css('padding-top').replace('px', ''))
                + parseInt(wrapper.css('padding-bottom').replace('px', ''))
                + parseInt(header.css('padding-top').replace('px', ''));
            return {
                width:  wrapper.width() - margin_x,
                height: wrapper.height() - margin_y
            }
        }
    };

    $.fn.projects_calendar_panel = function() {
        this.calendar_panel = new components.projects.calendar_panel();
        return this;
    };
})(jQuery, Motto)