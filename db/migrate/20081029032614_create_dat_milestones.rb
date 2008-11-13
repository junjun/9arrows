class CreateDatMilestones < ActiveRecord::Migration
  def self.up
    create_table :dat_milestones do |t|
      t.integer  "project_tree_id",    :null => false
      t.date     "mils_date"
      t.integer  "create_user_id",     :null => false
      t.datetime "created_on",         :null => false
      t.integer  "update_user_id",     :null => false
      t.datetime "updated_on",         :null => false
      t.integer  "last_operation_kbn"
    end
  end

  def self.down
    drop_table :dat_milestones
  end
end
