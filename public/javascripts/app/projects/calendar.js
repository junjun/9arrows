;(function($, $mo) {

App.ProjectsCalendar = function() {
    App.ProjectsCalendar.superclass.constructor.call(this);
}

App.ProjectsCalendar.prototype = {
    initialize: function() {
		var p_cd = Ext.get('current_project_project_cd').dom.value;
        components.projects.task_edit_dialog(p_cd);
        components.projects.milestone_edit_dialog(p_cd);
        components.projects.event_edit_dialog(p_cd);
        this.member_select_dialog = components.projects.member_select_dialog(p_cd);

        $mo.fire('created_page');
    },

    loaded: function() {
		var p_cd = Ext.get('current_project_project_cd').dom.value;
        var args = {project_cd: p_cd};
        $('a#projects_calendar_btn_add_task').click(function() {
            $mo.fire('open_projects_task_edit_dialog', args);
        });
        $('a#projects_calendar_btn_add_milestone').click(function() {
            $mo.fire('open_projects_milestone_edit_dialog', args);
        });
        $('a#projects_calendar_btn_add_event').click(function() {
            $mo.fire('open_projects_event_edit_dialog', args);
        });

        this.calendar_panel = $('#calendar_panel').projects_calendar_panel();
    }
}

Motto.extend(App.ProjectsCalendar, Page);
window.$page = $page = new App.ProjectsCalendar();

})(jQuery, Motto)