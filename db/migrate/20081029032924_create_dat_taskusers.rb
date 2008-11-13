class CreateDatTaskusers < ActiveRecord::Migration
  def self.up
    create_table :dat_taskusers do |t|
      t.integer  "task_id",        :null => false
      t.integer  "projectuser_id", :null => false
      t.integer  "create_user_id", :null => false
      t.datetime "created_on",     :null => false
    end
  end

  def self.down
    drop_table :dat_taskusers
  end
end
