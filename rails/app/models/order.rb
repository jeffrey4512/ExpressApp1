class Order < ApplicationRecord
  has_many :items, through: :order_items, source: :order_items
  belongs_to :user

  def total
    items.sum(&:price)
  end
end
