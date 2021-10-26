
@magic_shoes = []
shoes.each do |product|
  productModel = {
    name: product["metadata"]["titleModule"]["product_title"], 
    description: product["metadata"]["titleModule"]["product_description"], 
    image: product["product_small_image_urls"]["string"][0], 
    price_cents: product["app_sale_price"], 
    rating: product["feedBackRating"]["averageStar"], 
    sale: product["discount_rate"] > 0, 
    url: product["product_detail_url"]
  }
  
  @magic_shoes.push(productModel)
  
end

puts @magic_shoes