class AddCartsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :carts do |t|
      t.timestamps
    end
    create_table :carts_items do |t|
      t.timestamps
    end
    add_reference(:carts_items,:product,foreign_key: true)
    add_reference(:carts_items,:cart,foreign_key: true)
  end
end
