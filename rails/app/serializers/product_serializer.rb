class ProductSerializer < ActiveModel::Serializer
    attributes :name, :category, :summary, :price, :quantity
end