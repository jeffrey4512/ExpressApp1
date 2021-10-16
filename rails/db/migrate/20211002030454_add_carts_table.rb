class AddCartsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :carts do |t|
      t.timestamps
    end
    create_table :cart_items do |t|
      t.integer :item_quantity
      t.timestamps
    end
    add_reference(:carts,:user,foreign_key: true)
    add_reference(:cart_items,:product,foreign_key: true)
    add_reference(:cart_items,:cart,foreign_key: true)
  end
end
