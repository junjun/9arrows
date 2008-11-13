class ProjectcompsController < ApplicationController

  ###########################################################
  # メソッド：行番号更新用アクション
  # 概　　要：アイテムの行番号を更新する
  ###########################################################
  def item_order_update

    id = params[:id]
    offset = params[:offset]

    return unless my_item?(params[:id])# check permission

    # 対象のプロジェクト構成データを取得
    target = DatProjectcomp.find(id)

    # 入れ替え対象のプロジェクト構成データを取得
    if offset.to_i > 0
      replacement = DatProjectcomp.find(:first,
                                        :conditions=>[" project_id=? AND line_no > ?", target.project_id, target.line_no],
                                        :order=>"line_no asc"
                                        )
    else
      replacement = DatProjectcomp.find(:first,
                                        :conditions=>[" project_id=? AND line_no < ?", target.project_id, target.line_no],
                                        :order=>"line_no desc"
                                        )
    end

    # 入れ替え対象がある場合、行番号を入れ替え
    if ! replacement.nil?
      target_line_no = replacement.line_no
      replacement.line_no = target.line_no
      target.line_no = target_line_no
      
      target.save
      replacement.save
    end

    respond_to do |f|
      f.json { render :text => result_for_json(true, '', {}) }
    end

  end

end
