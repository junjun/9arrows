class DatTask < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # プロジェクト構成データに所有される(1:1)
  belongs_to :dat_projectcomp, :foreign_key => "project_tree_id"
  # タスクユーザーデータを所有する(1:多)
  has_many :dat_taskusers, :foreign_key => "task_id", :dependent=>:destroy
  # タスク履歴データを所有する(1:多)
  has_many :dat_taskhistories  , :foreign_key => "task_id", :dependent=>:destroy

  # 依頼者　プロジェクトユーザーマスタに所有される(1:多)
  belongs_to :dat_user_client, :class_name=>"DatProjectuser", :foreign_key=>"client_user_id"
  # 主担当者　プロジェクトマスタに所有される(1:多)
  belongs_to :dat_user_main, :class_name=>"DatProjectuser", :foreign_key=>"main_user_id"

  #########################
  # フィルタ定義
  #########################
  before_create :create_taskcd

  ###########################################################
  # メソッド：copyFromTemplate
  # 概　　要：指定されたテンプレートデータ(TPタスクマスタ）から
  #           属性値をコピーする
  # 引　　数：template     TPタスクマスタ(mst_tptask)オブジェクト
  # 戻 り 値：なし
  ###########################################################
  def copyFromTemplate(template)
    self.attributes.each_pair do | key, value |
      case key.to_s
      when "create_user_id"
      when "created_on"
      when "update_user_id"
      when "updated_on"
      else
        if ! template[key.to_s].nil?
          self[key.to_s] = template[key.to_s]
        end
      end
    end

  end

  def create_taskcd
    project_id = self.dat_projectcomp.project_id
    if ! project_id.nil?
      count = DatProjectcomp.count( :conditions=>[" project_id=? AND task_kbn=1 ",project_id] )  
      task_cd = sprintf("T%03d", count)
      write_attribute("task_cd", task_cd)
    end
  end

  def after_update
    if self.last_operation_kbn == 4
      projectlog = self.dat_projectcomp.dat_projectlogs.build
      if self.progress_kbn == 3
        projectlog.log_kbn = 5
      else
        projectlog.log_kbn = 4
      end
      projectlog.create_user_id = self.create_user_id
      projectlog.save
    end
  end

end
