class CreateDataPoints < ActiveRecord::Migration[7.1]
  def change
    create_table :data_points do |t|
      t.float :x
      t.float :y
      t.integer :labels
      t.integer :point_index
      t.string :barcode

      t.timestamps
    end
  end
end
