class TasksController < ApplicationController

  # コントローラー使用のヘルパー定義
  include ProjectsHelper
  include TasksHelper

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
      f.json { render :json => new_item }
    end
  end

  def show
    dlg_edit
  end

  def new_item
    #-----------------------------
    # 新規タスクオブジェクト生成
    #-----------------------------
    @task = DatTask.new

    # 依頼者はログインユーザーデフォルト
    projectuser = DatProjectuser.find_by_user_id(current_user.id)
    @task.client_user_id = projectuser.id

    #-----------------------------
    # 新規プロジェクト構成データオブジェクト生成
    # ※分類パラメータを初期設定（:dlg_tsk_edit_comp）
    #-----------------------------
    @projectcomp = DatProjectcomp.new(params[:dlg_tsk_edit_comp])
    @projectcomp.task_kbn = "1" ;

    #-----------------------------
    # 参加ユーザー情報の取得
    #-----------------------------
    # プロジェクト参加ユーザーリストを取得
    projectusers = object_for_projectusers(@current_project.id)

    # タスク参加ユーザーリストを取得
    taskusers = object_for_taskusers(@task.id)

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    result  = {
      :task           => @task.attributes,
      :projectcomp    => @projectcomp.attributes,
      :projectusers   => projectusers,
      :taskusers      => taskusers
    }
    result = result_for_json(true, '', result)
  end

  ###########################################################
  # メソッド：タスク編集アクション（ダイアログ用）
  # 概　　要：登録済みタスク情報をJSON形式で返す
  ###########################################################
  def dlg_edit
    comp_id = params[:id]

    if comp_id.nil? || comp_id == ""
      #-----------------------------
      # JSONデータ生成
      #-----------------------------
      result  = {
        :task           => @task.attributes,
        :projectcomp    => @projectcomp.attributes,
        :projectusers   => projectusers,
        :taskusers      => taskusers
      }

      render :text => result_for_json(true, '', result)
      return
    end

    return unless my_item?(comp_id)# check permission

    #-----------------------------
    # 登録済みプロジェクト構成情報を取得
    # ※プロジェクト、タスク情報も同時に取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", comp_id],
                          :include =>[:dat_project, :dat_task] )
    @task = @projectcomp.dat_task

    #-----------------------------
    # 参加ユーザー情報の取得
    #-----------------------------
    # プロジェクト参加ユーザーリストを取得
    projectusers = object_for_projectusers(@current_project.id)
    # タスク参加ユーザーリストを取得
    taskusers = object_for_taskusers(@task.id)

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    result  = {
      :task           => @task.attributes,
      :projectcomp    => @projectcomp.attributes,
      :projectusers   => projectusers,
      :taskusers      => taskusers
    }

    render :text => result_for_json(true, '', result)

  end

  def create
    session_user_id = @current_user.id

    params[:dlg_tsk_edit_comp].delete('id')
    params[:dlg_tsk_edit_task].delete('id')

    #-----------------------------
    # 新規プロジェクト構成データ生成
    #-----------------------------
    # フォームパラメータから新規プロジェクト構成オブジェクトを生成
    @projectcomp = DatProjectcomp.new(params[:dlg_tsk_edit_comp])
    @projectcomp.task_kbn = "1" ;
    @projectcomp.create_user_id = session_user_id
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 2
    #-----------------------------
    # 追加位置（行番号）決定
    #-----------------------------
    max_line_no = DatProjectcomp.maximum( :line_no,
                                          :conditions=>["project_id = ? ", @projectcomp.project_id]
                                        )
    max_line_no = 0 if max_line_no.nil?
    @projectcomp.line_no = max_line_no + 1

    #-----------------------------
    # プロジェクト構成データ保存実施
    #-----------------------------
    if !@projectcomp.save
      message = "プロジェクト構成データ保存実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    #-----------------------------
    # 新規タスクデータ生成
    #-----------------------------
    # フォームパラメータから新規タスクオブジェクトを生成
    @task = DatTask.new(params[:dlg_tsk_edit_task])
    @task.create_user_id = session_user_id
    @task.update_user_id = session_user_id
    @task.last_operation_kbn = 2
    @task.project_tree_id = @projectcomp.id

    #-----------------------------
    # タスク担当者生成
    #-----------------------------
    # タスクユーザー指定時、タスクユーザーオブジェクトを生成
    if ! params[:dlg_tsk_edit_taskusers].nil?
      for puser in params[:dlg_tsk_edit_taskusers][:projectuser_id]
        # buildにて生成し、ここでは保存しない
        taskuser = @task.dat_taskusers.build(:projectuser_id=>puser)
        taskuser.create_user_id = session_user_id
      end
    end
    if !@task.save
      message = "新規タスクデータ生成エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end
  end

  def update
    session_user_id = @current_user.id

    return unless my_item?(params[:dlg_tsk_edit_comp][:id])# check permission

    #-----------------------------
    # 登録済みオブジェクトを取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", params[:dlg_tsk_edit_comp][:id]],
                          :include =>[{:dat_task=>[:dat_taskusers]}] )
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 3
    @task = @projectcomp.dat_task
    @task.update_user_id = session_user_id
    @task.last_operation_kbn = 3

    #-----------------------------
    # タスク担当者生成
    #-----------------------------
    # タスクユーザー指定時、タスクユーザーオブジェクトを生成
    @task.dat_taskusers.clear  #一旦削除
    if ! params[:dlg_tsk_edit_taskusers].nil?
      for puser in params[:dlg_tsk_edit_taskusers][:projectuser_id]
        # buildにて生成し、ここでは保存しない
        taskuser = @task.dat_taskusers.build(:projectuser_id=>puser)
        taskuser.create_user_id = session_user_id
      end
    end

    #-----------------------------
    # プロジェクト構成データ保存実施
    #-----------------------------
    if ! @projectcomp.update_attributes(params[:dlg_tsk_edit_comp])
      message = "プロジェクト構成データ保存実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    #-----------------------------
    # タスクデータ保存実施
    #-----------------------------
    if ! @task.update_attributes(params[:dlg_tsk_edit_task])
      message = "タスクデータ保存実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end

  end

  def destroy
    return unless my_item?(params[:id])# check permission

    #-----------------------------
    # プロジェクト構成データ削除実施
    # ※関連データも同時に削除
    #-----------------------------
    projectcomp = DatProjectcomp.find(params[:id])
    if ! projectcomp.destroy
      message = "削除実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end
  end

end
