# -*- coding: utf-8 -*-
module Projects

  def prepared_project_info
    @current_user = current_user
    @current_project = get_current_project()
    @active_projects = get_active_projects()
  end

  def get_active_projects()
    u = current_user
    u.my_active_projects()
  end

  def get_current_project()
    code = params[:project_id] || params[:id]
    logger.debug code.inspect
    opt = {
      :include => [:dat_projectusers => :mst_user]
    }
    project = DatProject.find_by_project_cd(code, opt) if (!code.nil? and !code.blank?)
    project ||= nil
  end

  def my_item?(project_comp_id)
    user_id = current_user.id
    item = DatProjectcomp.find(project_comp_id)
    logger.debug item.inspect
    r = my_project?(item.project_id)
    render :text => result_for_json(false, 'Permission Dinied', {}) unless r
    r
  end

  # 現在ログイン中のユーザが指定されたプロジェクトに所属しているかをチェック
  def my_project?(project_id)
    if current_user and !project_id.blank?
      current_user_id = current_user.id
      project = DatProject.find(project_id)
      project_users = project.dat_projectusers.find(:all)
      ids = []
      project_users.map {|u| ids << u.user_id unless u.user_id.nil? }
      ids.include? current_user_id
    end
  end

  # オブジェクトルート
  def get_project_files_root(project_id)
    base_path = "#{RAILS_ROOT}#{$PROJECTFILES_ROOT}"
    if !File.exists?(base_path)
        Dir::mkdir( base_path )
    end

    base_path += project_id.to_s
    if !File.exists?(base_path)
        Dir::mkdir( base_path )
    end
    base_path
  end

end
