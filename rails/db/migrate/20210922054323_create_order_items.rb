class CreateOrderItems < ActiveRecord::Migration[6.1]
  def change
    create_table :order_items do |t|
      t.timestamps
    end
    add_reference(:order_items,:product,foreign_key: true)
    add_reference(:order_items,:order,foreign_key: true)
  end
end
