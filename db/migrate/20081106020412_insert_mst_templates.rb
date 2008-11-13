require 'active_record/fixtures'

class InsertMstTemplates < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_templates)
  end

  def self.down
  end
end
