class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders do |t|
      t.timestamps
    end
    add_reference(:orders,:user, foreign_key: true)
  end
end
