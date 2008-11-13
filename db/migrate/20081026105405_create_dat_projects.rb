class CreateDatProjects < ActiveRecord::Migration
  def self.up
    create_table :dat_projects do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :dat_projects
  end
end
