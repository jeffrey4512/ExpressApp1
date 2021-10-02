Rails.application.routes.draw do
  get 'cart/carts'
  resources :orders
  scope :admin do
    resources :products 
  end
  resources :products, only: [:index,:show]
end

