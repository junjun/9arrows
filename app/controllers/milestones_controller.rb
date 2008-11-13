class MilestonesController < ApplicationController

  # コントローラー使用のヘルパー定義
  include ProjectsHelper
  include MilestonesHelper

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
    # 新規マイルストーンオブジェクト生成
    #-----------------------------
    @miles = DatTask.new

    #-----------------------------
    # 新規プロジェクト構成データオブジェクト生成
    # ※分類パラメータを初期設定（:dlg_tsk_edit_comp）
    #-----------------------------
    @projectcomp = DatProjectcomp.new(params[:dlg_mil_edit_comp])
    @projectcomp.task_kbn = "2" ;

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    result  = {
      :miles           => @miles.attributes,
      :projectcomp    => @projectcomp.attributes
    }
    result
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
    # ※プロジェクト、マイルストーン情報も同時に取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", comp_id],
                          :include =>:dat_milestone )
    @miles = @projectcomp.dat_milestone

    #-----------------------------
    # JSONデータ生成
    #-----------------------------
    result  = {
      :miles           => @miles.attributes,
      :projectcomp    => @projectcomp.attributes
    }

    render :text => result_for_json(true, '', result)

  end

  def create
    session_user_id = @current_user.id

    #-----------------------------
    # 新規プロジェクト構成データ生成
    #-----------------------------
    # フォームパラメータから新規プロジェクト構成オブジェクトを生成
    @projectcomp = DatProjectcomp.new(params[:dlg_mil_edit_comp])
    @projectcomp.task_kbn = "2" ;
    @projectcomp.create_user_id = session_user_id
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 2

    #-----------------------------
    # 新規マイルストーンデータ生成
    #-----------------------------
    # フォームパラメータから新規マイルストーンオブジェクトを生成
    @miles = DatMilestone.new( params[:dlg_mil_edit_miles] )
    @miles.create_user_id = session_user_id
    @miles.update_user_id = session_user_id
    @miles.last_operation_kbn = 2
    @projectcomp.dat_milestone = @miles

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

    return unless my_item?(params[:dlg_mil_edit_comp][:id])# check permission

    #-----------------------------
    # 登録済みオブジェクトを取得
    #-----------------------------
    @projectcomp = DatProjectcomp.find(:first,
                          :conditions => [" dat_projectcomps.id = ? ", params[:dlg_mil_edit_comp][:id]],
                          :include =>:dat_milestone )
    @projectcomp.update_user_id = session_user_id
    @projectcomp.last_operation_kbn = 3
    @miles = @projectcomp.dat_milestone
    @miles.update_user_id = session_user_id
    @miles.last_operation_kbn = 3

    #-----------------------------
    # プロジェクト構成データ保存実施
    #-----------------------------
    if ! @projectcomp.update_attributes(params[:dlg_mil_edit_comp])
      message = "プロジェクト構成データ保存実施エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    #-----------------------------
    # マイルストーンデータ保存実施
    #-----------------------------
    if ! @miles.update_attributes(params[:dlg_mil_edit_miles])
      message = "マイルストーンデータ保存実施エラー"
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
