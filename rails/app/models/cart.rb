class Cart < ApplicationRecord
  has_many :items, through: :cart_items, source: :cart_items
  belongs_to :user

  def total
    items.sum(&:price)
  end
end