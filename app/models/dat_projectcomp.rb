# -*- coding: utf-8 -*-
class DatProjectcomp < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # プロジェクトデータに所有される(1:多)
  belongs_to :dat_project, :foreign_key => "project_id"
  # マイルストーンデータを所有する(1:1)
  has_one :dat_milestone, :foreign_key => "project_tree_id", :dependent=>:destroy
  # タスクデータを所有する(1:1)
  has_one :dat_task, :foreign_key => "project_tree_id", :dependent=>:destroy
  # イベントデータを所有する(1:1)
  has_one :dat_event, :foreign_key => "project_tree_id", :dependent=>:destroy
  # プロジェクトログデータを所有する(1:多)
  has_many :dat_projectlogs, :foreign_key => "projectcomp_id"

  # ユーザーマスタに所有される(1:多)
  belongs_to :mst_user_create, :class_name=>"MstUser", :foreign_key=>"create_user_id"
  # ユーザーマスタに所有される(1:多)
  belongs_to :mst_user_update, :class_name=>"MstUser", :foreign_key=>"update_user_id"

  TASK_KBN = {
    1 => :task,
    2 => :milestone,
    3 => :event,
  }

  # task_kbn
  def taskkbn
    TASK_KBN[task_kbn]
  end

  def comp_item
    item = case taskkbn
           when :task      then dat_task
           when :milestone then dat_milestone
           when :event     then dat_event
           end
    item
  end

  # start_date
  def get_dates
    item = comp_item()
    dates = case taskkbn
           when :task      then [item.start_date, item.end_date]
           when :milestone then [item.mils_date, nil]
           when :event     then [item.start_date, nil]
           end
    dates
  end

  def comp_name
    
  end

  ###########################################################
  # メソッド：copyFromTemplate
  # 概　　要：指定されたテンプレートデータ(テンプレート構成マスタ）から
  #           属性値をコピーする
  # 引　　数：template     テンプレート構成マスタ(mst_composition)オブジェクト
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

    if ! template.mst_tptask.nil?
      task = DatTask.new
      task.create_user_id = self.create_user_id
      task.update_user_id = self.update_user_id
      task.last_operation_kbn = 1
      task.copyFromTemplate(template.mst_tptask)
      self.dat_task = task 
    end

    if ! template.mst_tpmilestone.nil?
      milestone = DatMilestone.new
      milestone.create_user_id = self.create_user_id
      milestone.update_user_id = self.update_user_id
      milestone.last_operation_kbn = 1
      milestone.copyFromTemplate(template.mst_tpmilestone)
      self.dat_milestone = milestone 
    end

    if ! template.mst_tpevent.nil?
      event = DatEvent.new
      event.create_user_id = self.create_user_id
      event.update_user_id = self.update_user_id
      event.last_operation_kbn = 1
      event.copyFromTemplate(template.mst_tpevent)
      self.dat_event = event 
    end

  end


  def after_create
    projectlog = self.dat_projectlogs.build
    projectlog.log_kbn = 1
    projectlog.create_user_id = self.create_user_id
    projectlog.save
  end
  def after_update
    projectlog = self.dat_projectlogs.build
    projectlog.log_kbn = 2
    projectlog.create_user_id = self.create_user_id
    projectlog.save
  end
  def after_destroy
    projectlog = self.dat_projectlogs.build
    projectlog.log_kbn = 3
    projectlog.create_user_id = self.create_user_id
    projectlog.save
  end

end
