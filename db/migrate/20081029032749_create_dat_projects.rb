class CreateDatProjects < ActiveRecord::Migration
  def self.up
    create_table :dat_projects do |t|
      t.string   "project_cd",                    :null => false
      t.string   "project_name",                  :null => false
      t.date     "start_date"
      t.date     "delivery_date"
      t.integer  "valid_flg",      :default => 1, :null => false
      t.integer  "create_user_id",                :null => false
      t.datetime "created_on",                    :null => false
      t.integer  "update_user_id",                :null => false
      t.datetime "updated_on",                    :null => false
      t.string   "end_user_name"
    end
  end

  def self.down
    drop_table :dat_projects
  end
end
