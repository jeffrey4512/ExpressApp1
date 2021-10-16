class CartController < ApplicationController
  before_action :set_cart
  before_action :add_cart_items, only: [:add_to_cart]
  before_action :remove_cart_items, only: [:remove_from_cart]
  skip_before_action :verify_authenticity_token
  def show
    render json: @cart , serializer: CartSerializer
  end

  # POST /carts or /carts.json
  def add_to_cart
      render json: @cart.reload , serializer: CartSerializer
  end

  def remove_from_cart
    render json: @cart.reload , serializer: CartSerializer
  end

  # DELETE /carts/1 or /carts/1.json
  def destroy
    @cart.destroy
    format.json { head :no_content }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cart
      @cart = Cart.find_or_create_by(user_id: cart_params[:user_id])
    end

    # Only allow a list of trusted parameters through.
    def cart_params
      params.permit(:cart,:user_id, cart_items: [:product_id,:item_quantity])
    end

    def cart_items 
      cart_params["cart_items"]
    end

    def user_id
      cart_params["user_id"]
    end

    def add_cart_items
      cart_items.each do |i|
        cart_item =  CartItem.find_by(product_id: i['product_id'], cart_id: @cart.id)
        if cart_item
          cart_item.update(item_quantity: cart_item.item_quantity += i['item_quantity'].to_i)
          cart_item
        else 
          CartItem.new(product_id: i['product_id'], cart_id: @cart.id,item_quantity: i['item_quantity']).save
        end
      end
    end

    def remove_cart_items
      cart_items.map do |i|
        if @cart.id
          cart_item =  CartItem.find_by(product_id: i['product_id'], cart_id: @cart.id) 
          if cart_item
            cart_item.update(item_quantity: cart_item.item_quantity -= i['item_quantity'].to_i)
            cart_item.destroy if !cart_item.item_quantity.positive?
          end
        end
      end
    end
end
