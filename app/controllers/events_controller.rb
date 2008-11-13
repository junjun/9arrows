class EventsController < ApplicationController

  # コントローラー使用のヘルパー定義
  include ProjectsHelper
  include EventsHelper

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
    # 新規イベントオブジェクト生成
    #-----------------------------
    @event = DatEvent.new

    #-----------------------------
    # 新規プロジェクト構成データオブジェクト生成
    # ※分類パラメータを初期設定（:dlg_tsk_edit_comp）
    #-----------------------------
    @projectcomp = DatProjectcomp.new(params[:dlg_evt_edit_comp])
    @projectcomp.task_kbn = "3" ;

    #-----------------------------
    # 参加ユーザー情報の取得
    #-----------------------------
    # プロジェクト参加ユーザーリストを取得
    projectusers = object_for_projectusers(@current_project.id)
    # イベント参加ユーザーリストを取得
    eventusers = object_for_eventusers(@event.id)

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    result  = {
      :event          => @event.attributes,
      :projectcomp    => @projectcomp.attributes,
      :projectusers   => projectusers,
      :eventusers     => eventusers
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
      # IDが指定されていない場合、新規作成処理へリダイレクト
      #-----------------------------
      redirect_to :action => 'dlg_new'
      return
    end

    return unless my_item?(comp_id)# check permission

    #-----------------------------
    # 登録済みプロジェクト構成情報を取得
    # ※プロジェクト、イベント情報も同時に取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", comp_id],
                          :include =>[:dat_project, :dat_event] )
    @event = @projectcomp.dat_event

    #-----------------------------
    # 参加ユーザー情報の取得
    #-----------------------------
    # プロジェクト参加ユーザーリストを取得
    projectusers = object_for_projectusers(@current_project.id)
    # イベント参加ユーザーリストを取得
    eventusers = object_for_eventusers(@event.id)

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    event_att = @event.attributes
    event_att['start_time'] = event_att['start_time'] ? event_att['start_time'].strftime('%H:%M:%S') : ''
    event_att['end_time'] = event_att['end_time'] ? event_att['end_time'].strftime('%H:%M:%S') : ''

    result  = {
      :event          => event_att,
      :projectcomp    => @projectcomp.attributes,
      :projectusers   => projectusers,
      :eventusers     => eventusers
    }

    render :text => result_for_json(true, '', result)

  end

  def create
    session_user_id = @current_user.id

    #-----------------------------
    # 新規プロジェクト構成データ生成
    #-----------------------------
    # フォームパラメータから新規プロジェクト構成オブジェクトを生成
    @projectcomp = DatProjectcomp.new(params[:dlg_evt_edit_comp])
    @projectcomp.task_kbn = "3" ;
    @projectcomp.create_user_id = session_user_id
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 2

    #-----------------------------
    # 新規イベントデータ生成
    #-----------------------------
    # フォームパラメータから新規イベントオブジェクトを生成
    @event = DatEvent.new( params[:dlg_evt_edit_event] )
    @event.create_user_id = session_user_id
    @event.update_user_id = session_user_id
    @event.last_operation_kbn = 2
    @projectcomp.dat_event = @event

    #-----------------------------
    # 追加位置（行番号）決定
    #-----------------------------
    max_line_no = DatProjectcomp.maximum( :line_no,
                                          :conditions=>["project_id = ? ", @projectcomp.project_id]
                                        )
    max_line_no = 0 if max_line_no.nil?
    @projectcomp.line_no = max_line_no + 1

    #-----------------------------
    # イベント担当者生成
    #-----------------------------
    # イベントユーザー指定時、イベントユーザーオブジェクトを生成
    if ! params[:dlg_evt_edit_eventusers].nil?
      for puser in params[:dlg_evt_edit_eventusers][:projectuser_id]
        # buildにて生成し、ここでは保存しない
        eventuser = @event.dat_eventusers.build(:projectuser_id=>puser)
        eventuser.create_user_id = session_user_id
      end
    end

    #-----------------------------
    # プロジェクト構成データ保存実施
    #-----------------------------
    if ! @projectcomp.save
      message = "プロジェクト構成データ保存実施エラー"
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

    return unless my_item?(params[:dlg_evt_edit_comp][:id])# check permission

    #-----------------------------
    # 登録済みオブジェクトを取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", params[:dlg_evt_edit_comp][:id]],
                          :include =>[{:dat_event=>[:dat_eventusers]}] )
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 3
    @event = @projectcomp.dat_event
    @event.update_user_id = session_user_id
    @event.last_operation_kbn = 3

    #-----------------------------
    # イベント担当者生成
    #-----------------------------
    # イベントユーザー指定時、イベントユーザーオブジェクトを生成
    @event.dat_eventusers.clear  #一旦削除
    if ! params[:dlg_evt_edit_eventusers].nil?
      for puser in params[:dlg_evt_edit_eventusers][:projectuser_id]
        # buildにて生成し、ここでは保存しない
        eventuser = @event.dat_eventusers.build(:projectuser_id=>puser)
        eventuser.create_user_id = session_user_id
      end
    end

    #-----------------------------
    # プロジェクト構成データ保存実施
    #-----------------------------
    if ! @projectcomp.update_attributes(params[:dlg_evt_edit_comp])
      message = "プロジェクト構成データ保存実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end
    #-----------------------------
    # イベントデータ保存実施
    #-----------------------------
    if ! @event.update_attributes(params[:dlg_evt_edit_event])
      message = "イベントデータ保存実施エラー"
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
