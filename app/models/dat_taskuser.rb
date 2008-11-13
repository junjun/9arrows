class DatTaskuser < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # タスクデータに所有される(1:多)
  belongs_to :dat_task, :foreign_key=>"task_id"

  # プロジェクトユーザーデータに所有される(1:多)
  belongs_to :dat_projectuser, :foreign_key=>"projectuser_id"

end
