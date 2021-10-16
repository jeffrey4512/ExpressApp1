class CartSerializer < ActiveModel::Serializer
  attributes :id, :total
  has_many :cart_items

  def total
    object.total
  end
  class CartItemSerializer < ActiveModel::Serializer
    attributes :name, :category, :summary, :price, :item_quantity

    def name
      object.product.name
    end

    def category
      object.product.category
    end

    def summary
      object.product.summary
    end

    def price
      object.product.price
    end
  end
end
