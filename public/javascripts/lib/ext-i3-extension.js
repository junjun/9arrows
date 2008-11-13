
Ext.namespace('Ext.i3');
Ext.namespace('Ext.i3.data');
Ext.namespace('Ext.i3.grid');


/*---------------------------------------------
 * GroupJsonReaderクラス定義
 *--------------------------------------------- */
Ext.i3.data.GroupJsonReader = function(meta, recordType) {
    meta = meta || {};
    Ext.i3.data.GroupJsonReader.superclass.constructor.call(this, meta, recordType||meta.fields);
};
Ext.extend(Ext.i3.data.GroupJsonReader, Ext.data.JsonReader, {});

/*---------------------------------------------
 * GroupJsonStoreクラス定義
 *--------------------------------------------- */
Ext.i3.data.GroupJsonStore = function(c) {
    this.nodedata = new Ext.util.MixedCollection(false);
    Ext.i3.data.GroupJsonStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: !c.data ? new Ext.data.HttpProxy({url: c.url}) : undefined,
        reader: new Ext.i3.data.GroupJsonReader(c, c.fields)
    }));
};
Ext.extend(Ext.i3.data.GroupJsonStore, Ext.data.JsonStore, {

    loadRecords : function(o, options, success){
        if(!o || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        var new_r = [] ;
        if(!options || options.add !== true){
            if(this.pruneModifiedRecords){
                this.modified = [];
            }
            for(var i = 0, len = r.length; i < len; i++){
                // configで指定されたグループフィールドごとに、グループレコードを生成
                new_r = new_r.concat( this.fncConvertGroupRow( r, i ) ) ;
            }
            this.data.clear();
            this.data.addAll(new_r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", {});
        }else{
            this.totalLength = Math.max(t, this.data.length+r.length);
            this.add(r);
        }
        this.fireEvent("load", this, r, options);
        if(options.callback){
            options.callback.call(options.scope || this, r, options, true);
        }
    },
    
    /*
     * 関数名：fncConvertGroupRow
     * 概　要：グループデータへの変換
     * 引　数：なし
     * 戻り値：なし
     */
    fncConvertGroupRow : function( records, index ){
        records[index].join( this );
        var grouprec = this.fncCreateGroupRow(records[index-1], records[index]);
        records[index].data.isgroup  = false ;
        records[index].data.level    = this.fncGetDataLevel(records[index]);

        return grouprec.concat( records[index] ) ;
    },
    
    /*
     * 関数名：fncCreateGroupRow
     * 概　要：グループデータ行生成
     * 引　数：なし
     * 戻り値：なし
     */
    fncCreateGroupRow : function(prerec, currec, level, force, config){
        var cur_level   = (level == null) ? 0 : level;
        var force       = (force == null) ? false : force;
        var next_config = (config == null) ? {} : config;

        if (this.groups[cur_level] == null) return [];
        
        var grouprec      = [];
        var group_field   = this.groups[cur_level].name;
        var group_mapping = this.groups[cur_level].mapping == null ? group_field : this.groups[cur_level].mapping;
        var pre_group     = prerec != null ? prerec.data[group_field] : "";
        var cur_group     = currec.data[group_field];

        // 現在チェック中のグループ値が異なる場合、グループ用レコードを生成
        if( (pre_group != cur_group && cur_group != "" && cur_group != null) ||
            (pre_group == cur_group && cur_group != "" && cur_group != null && force ) ){

            var newrec = {} ;
            if( this.copyfields ){
                for( var ci=0 ; ci<this.copyfields.length ; ci++ ){
                    newrec[ this.copyfields[ci].name ] = currec.data[ this.copyfields[ci].name ] ;
                }
            }

            newrec['isgroup']     = true;
            newrec['level']       = cur_level;
            newrec[group_mapping] = cur_group;
            newrec[group_field]   = cur_group;
            Ext.apply( newrec, next_config );
            var newrecord = new Ext.data.Record(newrec);
            newrecord.join(this) ;
            grouprec.push(newrecord);

            next_config[group_field]  = cur_group;
            grouprec = grouprec.concat(this.fncCreateGroupRow(prerec, currec, ++cur_level, true, next_config));
        } else {
            next_config[group_field]  = cur_group;
            grouprec = grouprec.concat(this.fncCreateGroupRow( prerec, currec, ++cur_level, false, next_config));
        }
        return grouprec ;
    },
    
    fncGetDataLevel : function( currec, level ){
        var cur_level = level == null ? 0 : level ;

        if( this.groups[cur_level] == null )   return cur_level ;
        
        var group_field = this.groups[cur_level].name ;
        var cur_group = currec.data[group_field] ;
        
        if( cur_group == "" || cur_group == null ){
            return cur_level ;
        }
        else{
            return this.fncGetDataLevel( currec, ++cur_level ) ;
        }
    }

});

/*---------------------------------------------
 * GroupGridViewクラス定義
 *--------------------------------------------- */
Ext.i3.grid.GroupGridView = function(c){
    Ext.i3.grid.GroupGridView.superclass.constructor.call(this, c);

};
Ext.extend(Ext.i3.grid.GroupGridView, Ext.grid.GridView, {


    /**
     * expandGroup
     * Expand children
     */
    expandGroup: function(rowIndex)
    {
        var ds  = this.ds;
        var rec = ds.getAt(rowIndex);
        var is_group = rec.get('isgroup');
        if(is_group) {
            
            var level  = rec.get('level');
            var expand = rec.get('expand');
            if (typeof expand == 'undefined') expand = true;
            var disp  = (expand) ? 'none' : 'block';
            var style = 'display:' + disp;
                
            var index = rowIndex + 1;
            while ((r = ds.getAt(index))) {
                if (level >= r.get('level')) break;

                var row = this.getRow(index);
                //var elm = Ext.fly(row);
                //elm.setStyle('display', disp);
                Ext.DomHelper.applyStyles(row, style);
                index++;
            }
            rec.set('expand', !expand);
            var current_row = Ext.fly(this.getRow(rowIndex));
            if (expand) {
                current_row.removeClass(current_row, "i3_extension_row_groups_expand_true");
                current_row.addClass(current_row, "i3_extension_row_groups_expand_false");
            } else {
                current_row.removeClass(current_row, "i3_extension_row_groups_expand_false");
                current_row.addClass(current_row, "i3_extension_row_groups_expand_true");
            }
            //this.layout();
        }
    },

    onRowSelect : function(rowIndex)
    {
        Ext.i3.grid.GroupGridView.superclass.onRowSelect.call(this, rowIndex);
        return true;

        var ds = this.ds;
        var r  = ds.getAt(rowIndex);
        var isgroup = r.data.isgroup;
        var level   = r.data.level;
        
        if (isgroup) {
            var style  = "display:block";
            var expand = true;
            if (r.data.expand == null || r.data.expand == true) {
                style = "display:none" ;
                expand = false ;
            }

            var nextindex = rowIndex + 1;
            var next      = ds.getAt(nextindex);
            while (next != null) {
                if (level >= next.data.level) break;
                
                var row = this.getRow(nextindex);
                Ext.DomHelper.applyStyles(row, style);

                nextindex++;
                next = ds.getAt(nextindex);
            }

            r.data.expand = expand;

            var row = this.getRow(rowIndex);
            if (expand) {
                row.className = row.className.replace("i3_extension_row_groups_expand_false", "i3_extension_row_groups_expand_true");
                //this.removeRowClass(row, "i3_extension_row_groups_expand_false");
                //this.addRowClass(row, "i3_extension_row_groups_expand_true");
            } else {
                row.className = row.className.replace("i3_extension_row_groups_expand_true", "i3_extension_row_groups_expand_false");
                //this.removeRowClass(row, "i3_extension_row_groups_expand_true");
                //this.addRowClass(row, "i3_extension_row_groups_expand_false");
            }
            this.layout();
        }
    },

    getRowClass : function(record, index)
    {
        var cssclass = "";
        if( record.get("isgroup") ){
            if (record.data.expand == null || record.data.expand) {
                cssclass = "i3_extension_row_groups_expand_true" ;
            } else {
                cssclass = "i3_extension_row_groups_expand_false" ;
            }
        }
        if (this.getRowClassExtension) {
            cssclass += " " + this.getRowClassExtension(record, index);
        }
        return cssclass ;
    }
});
