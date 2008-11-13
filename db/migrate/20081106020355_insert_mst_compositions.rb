require 'active_record/fixtures'

class InsertMstCompositions < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_compositions)
  end

  def self.down
  end
end
