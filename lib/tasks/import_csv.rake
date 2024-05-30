namespace :csv do
     desc "Import data points from CSV"
     task import: :environment do
       require 'csv'
   
       file_path = Rails.root.join('db', 'data', 'umap_all_cells.csv')
       CSV.foreach(file_path, headers: true) do |row|
         DataPoint.create!(
           x: row['x'].to_f,
           y: row['y'].to_f,
           labels: row['labels'].to_i,
           point_index: row['point_index'].to_i,
           barcode: row['barcode']
         )
       end
   
       puts "Data imported successfully"
     end
   end
   