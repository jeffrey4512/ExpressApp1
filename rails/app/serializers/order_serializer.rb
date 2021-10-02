class OrderSerializer < ActiveModel::Serializer
  attributes :id, :items, total


  def total
    @order.total
  end
  class ItemSerializer < ActiveModel::Serializer
    attributes :name, :category, :summary, :price, :quantity
  end
end
