class CreateMstUsers < ActiveRecord::Migration
  def self.up
    create_table :mst_users do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :mst_users
  end
end
