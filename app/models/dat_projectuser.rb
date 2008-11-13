class DatProjectuser < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # プロジェクトデータに所有される(1:多)
  belongs_to :dat_project, :foreign_key => "project_id"
  
  # ユーザーマスタに所有される(1:多)
  belongs_to :mst_user, :foreign_key=>"user_id"

  # タスクユーザーデータを所有する(1:多)
  has_many :dat_taskusers, :foreign_key=>"projectuser_id", :dependent=>:destroy
  # イベントユーザーデータを所有する(1:多)
  has_many :dat_eventusers, :foreign_key=>"projectuser_id", :dependent=>:destroy

  # タスクデータを所有する(1:多)　－　依頼者
  has_many :dat_task_client, :class_name=>"DatTask", :foreign_key=>"client_user_id", :dependent=>:nullify
  # タスクデータを所有する(1:多)　－　主担当者
  has_many :dat_task_main, :class_name=>"DatTask", :foreign_key=>"main_user_id", :dependent=>:nullify

end
