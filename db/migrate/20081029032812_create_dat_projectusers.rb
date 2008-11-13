class CreateDatProjectusers < ActiveRecord::Migration
  def self.up
    create_table :dat_projectusers do |t|
      t.integer  "project_id",                                  :null => false
      t.string   "email",          :limit => 40,                :null => false
      t.integer  "user_id"
      t.integer  "create_user_id",                              :null => false
      t.datetime "created_on",                                  :null => false
      t.integer  "active_flg",                   :default => 1
    end
  end

  def self.down
    drop_table :dat_projectusers
  end
end
