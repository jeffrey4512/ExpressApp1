Rails.application.routes.draw do
  resources :orders
  scope :admin do
    resources :products 
  end
  resources :products, only: [:index,:show]
end

