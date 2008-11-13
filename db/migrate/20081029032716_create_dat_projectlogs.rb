class CreateDatProjectlogs < ActiveRecord::Migration
  def self.up
    create_table :dat_projectlogs do |t|
      t.integer  "projectcomp_id", :null => false
      t.integer  "log_kbn",        :null => false
      t.integer  "create_user_id", :null => false
      t.datetime "created_on",     :null => false
    end
  end

  def self.down
    drop_table :dat_projectlogs
  end
end
