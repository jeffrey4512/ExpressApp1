class Cart < ApplicationRecord
  has_many :cart_items
  has_many :products, through: :cart_items
  belongs_to :user
  validates_uniqueness_of :user_id
  def total
    cart_items.reduce(0) {|sum,i|  sum += (i.product.price.to_f * i.item_quantity.to_f)}
  end
end