class ProductsController < ApplicationController
  before_action :set_product, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token

  def index
    render json: Product.all, each_serializer: ProductSerializer
  end

  # GET /products/1 or /products/1.json
  def show
    render json: @product , serializer: ProductSerializer
  end

  # GET /products/1/edit
  def edit
   @product.update(allowed_params)
   @product.save
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
    if @product.save
      render json: @product , serializer: ProductSerializer
    else
      render json: @product.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /products/1 or /products/1.json
  def update
    if @product.update(product_params)
      render json: @product , serializer: ProductSerializer
    else
      render json: @product.errors, status: :unprocessable_entity }
    end
  end

  # DELETE /products/1 or /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url, notice: "Product was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name, :category, :summary,:price,:quantity)
    end
end
