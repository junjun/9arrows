class CreateDatProjectusers < ActiveRecord::Migration
  def self.up
    create_table :dat_projectusers do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :dat_projectusers
  end
end
