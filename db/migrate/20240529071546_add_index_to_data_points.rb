class AddIndexToDataPoints < ActiveRecord::Migration[7.1]
  def change
    add_index :data_points, :point_index
  end
end
