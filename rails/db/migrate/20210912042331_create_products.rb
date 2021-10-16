class CreateProducts < ActiveRecord::Migration[6.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.text :summary, null: false
      t.decimal :price, precision: 10,scale: 2
      t.integer :quantity, null: false
      t.timestamps
    end
  end
end
