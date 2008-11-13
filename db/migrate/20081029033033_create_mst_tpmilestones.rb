class CreateMstTpmilestones < ActiveRecord::Migration
  def self.up
    create_table :mst_tpmilestones do |t|
      t.integer  "template_tree_id", :null => false
      t.integer  "create_user_id",   :null => false
      t.datetime "created_on",       :null => false
      t.integer  "update_user_id",   :null => false
      t.datetime "updated_on",       :null => false
    end
  end

  def self.down
    drop_table :mst_tpmilestones
  end
end
