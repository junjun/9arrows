/**
 * @author admin
 */
;(function($, $mo) {

App.ProjectsIndex = function() {
    App.ProjectsIndex.superclass.constructor.call(this);
}

App.ProjectsIndex.prototype = {
    initialize: function() {
        this.fncSetEventForProjects();
    },

    fncSetEventForProjects : function()
    {
        var _enable_projects  = Ext.query('a.update_active_link_add');
        Ext.each(_enable_projects, function(e) {
            Ext.get(e).addListener('click', this.onClickProjectAdd, this, true);
        }, this);
        var _disable_projects = Ext.query('a.update_active_link_remove');
        Ext.each(_disable_projects, function(e) {
            Ext.get(e).addListener('click', this.onClickProjectRemove, this, true);
        }, this);
    },

    onClickProjectAdd : function(e)
    {
        var _prefix = 'update_active_link_add_';
        var target  = new Ext.Element(e.getTarget());
        var parent  = target.parent();
        var project_id = parent.id.replace(_prefix, '');

        this.fncToggleProjectAvailable(project_id, 1);
    },

    onClickProjectRemove : function(e)
    {
        var _prefix = 'update_active_link_remove_';
        var target  = new Ext.Element(e.getTarget());
        var parent  = target.parent();
        var project_id = parent.id.replace(_prefix, '');

        this.fncToggleProjectAvailable(project_id, 2);
    },

    fncToggleProjectAvailable : function(project_id, kbn)
    {
        var url = url_for('projects.json');
        var opt = {
            url: url,
            params: {id : project_id, active_flg : kbn},
            success: this.onAvailableSuccess,
            failure: this.onAvailableFailure,
            method: 'get',
            scope: this
        }
        Ext.Ajax.request(opt);
    },

    onAvailableSuccess: function(r) {            
        var r = $mo.decode(r.responseText);
        var success = r.success ;
        var message = r.message ;
        var resultobj = r.result ;
        if (success){
            location.reload(true);
        } else {
            alert(message);
        }
    },
    onAvailableFailure: function(r) {
        var message = $mo.decode(r.responseText).message;
        alert(message);
    },

    loaded: function()
    {
    }
}

Motto.extend(App.ProjectsIndex, Page);
window.$page = $page = new App.ProjectsIndex();

})(jQuery, Motto);
