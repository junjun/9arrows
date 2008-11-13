class CreateDatEventusers < ActiveRecord::Migration
  def self.up
    create_table :dat_eventusers do |t|
      t.integer  "event_id",                      :null => false
      t.integer  "projectuser_id",                :null => false
      t.integer  "entry_flg",      :default => 0, :null => false
      t.integer  "create_user_id",                :null => false
      t.datetime "created_on",                    :null => false
    end
  end

  def self.down
    drop_table :dat_eventusers
  end
end
