class MstComposition < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # テンプレートマスタに所有される(1:多)
  belongs_to :mst_template, :foreign_key => "template_id"
  # TPタスクマスタを所有する(1:1)
  has_one :mst_tptask, :foreign_key => "template_tree_id", :dependent=>:destroy
  # TPマイルストーンマスタを所有する(1:1)
  has_one :mst_tpmilestone, :foreign_key => "template_tree_id", :dependent=>:destroy
  # TPイベントマスタを所有する(1:1)
  has_one :mst_tpevent, :foreign_key => "template_tree_id", :dependent=>:destroy

end
