
Ext.lib.Ajax = function(){
    var createComplete = function(cb){
         return function(xhr, status){
            if((status == 'error' || status == 'timeout') && cb.failure){
                cb.failure.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }else if(cb.success){
                cb.success.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }
         };
    };
    return {
        request : function(method, uri, cb, data, options){
            var o = {
                type: method,
                url: uri,
                data: data,
                timeout: cb.timeout,
                complete: createComplete(cb)
            };

            if(options){
                var hs = options.headers;
                if(options.xmlData){
                    o.data = options.xmlData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'text/xml';
                    }
                }else if(options.jsonData){
                    o.data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
                    o.processData = false;
                    o.type = (method ? method : (options.method ? options.method : 'POST'));
                    if (!hs || !hs['Content-Type']){
                        o.contentType = 'application/json';
                    }
                }
                
                if (o.type.toUpperCase() == 'PUT' || o.type.toUpperCase() == 'DELETE') {
                    o.data = o.data || {};
                    o.data['_method'] = o.type;
                    o.data['authenticity_token'] = authenticity_token;
                    // o.type = 'POST';
                }
                
                if(hs){
                    o.beforeSend = function(xhr){
                        for(var h in hs){
                            if(hs.hasOwnProperty(h)){
                                xhr.setRequestHeader(h, hs[h]);
                            }
                        }
                    }
                }
            }
            jQuery.ajax(o);
        },

        formRequest : function(form, uri, cb, data, isUpload, sslUri){
            jQuery.ajax({
                type: Ext.getDom(form).method ||'POST',
                url: uri,
                data: jQuery(form).serialize()+(data?'&'+data:''),
                timeout: cb.timeout,
                complete: createComplete(cb)
            });
        },

        isCallInProgress : function(trans){
            return false;
        },

        abort : function(trans){
            return false;
        },

        serializeForm : function(form){
            return jQuery(form.dom||form).serialize();
        }
    };
}();
