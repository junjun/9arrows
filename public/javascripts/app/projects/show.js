/**
 * @author admin
 */
;(function($, $mo) {

App.ProjectsShow = function() {
    App.ProjectsShow.superclass.constructor.call(this);
}

App.ProjectsShow.prototype = {
    initialize: function() {
		this.p_cd = Ext.get('current_project_project_cd').dom.value;

        components.projects.task_report_dialog(this.p_cd);
        components.projects.task_confirm_dialog(this.p_cd);
        $mo.fire('created_page');
    },

    onTskReport: function(id){
        $mo.fire('open_projects_task_report_dialog', {p_cd : this.p_cd, comp_id : id});
    },

    onTskConfir: function(id){
        $mo.fire('open_projects_task_confirm_dialog', {p_cd : this.p_cd, comp_id : id});
    },

    loaded: function()
    {
    }
}

Motto.extend(App.ProjectsShow, Page);
window.$page = $page = new App.ProjectsShow();

})(jQuery, Motto);
