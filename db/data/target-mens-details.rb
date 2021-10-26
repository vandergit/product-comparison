
@target_mens = []
mens.each do |product|
  productModel = {
    name: product["data"]["product"]["item"]["product_description"]["title"], 
    description: product["data"]["product"]["item"]["product_description"]["bullet_descriptions"].to_s, 
    image: product["data"]["product"]["item"]["enrichment"]["images"]["primary_image_url"], 
    price_cents: product["data"]["product"]["price"]["current_retail_max"], 
    rating: product["data"]["product"]["ratings_and_reviews"]["statistics"]["rating"]["average"], 
    sale: product["data"]["product"]["price"]["formatted_current_price_type"] === "sale", 
    url: product["data"]["product"]["item"]["enrichment"]["buy_url"]
  }
  
  @target_mens.push(productModel)
end

puts @target_mens