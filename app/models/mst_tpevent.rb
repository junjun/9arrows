class MstTpevent < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # テンプレート構成マスタに所有される(1:1)
  belongs_to :mst_composition, :foreign_key => "template_tree_id"

end
