class Product < ApplicationRecord
  has_many :reviews

  def purchase
    self.update(quantity: quantity - 1)
  end

  def good_reviews 
    reviews.filter{|i| i < 3}
  end

  def bad_reviews 
    reviews.select{|i| i < 3}
  end
end
