export const initialCategories = [
  {
    id: "sarees",
    nameEn: "Sarees",
    nameTa: "புடவைகள் (சாரீஸ்)",
    slug: "sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    itemCount: 42,
    featured: true
  },
  {
    id: "kurtis",
    nameEn: "Kurtis & Sets",
    nameTa: "குர்திகள் & செட்ஸ்",
    slug: "kurtis",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    itemCount: 38,
    featured: true
  },
  {
    id: "dresses",
    nameEn: "Anarkalis & Dresses",
    nameTa: "அனார்கலி & ஆடைகள்",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    itemCount: 29,
    featured: true
  },
  {
    id: "tops",
    nameEn: "Tops & Tunics",
    nameTa: "டாப்ஸ் & டியூனிக்ஸ்",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    itemCount: 24,
    featured: true
  },
  {
    id: "leggings",
    nameEn: "Leggings & Palazzos",
    nameTa: "லெக்கின்ஸ் & பலாசோ",
    slug: "leggings",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    itemCount: 19,
    featured: true
  },
  {
    id: "ethnic",
    nameEn: "Festive Ethnic Wear",
    nameTa: "பண்டிகை பாரம்பரிய உடைகள்",
    slug: "ethnic-wear",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    itemCount: 31,
    featured: true
  }
];

export const initialProducts = [
  {
    id: "prod-101",
    sku: "VL-SAR-01",
    nameEn: "Dindigul Handloom Zari Silk Saree",
    nameTa: "திண்டுக்கல் கைத்தறி ஜரி பட்டு புடவை",
    category: "sarees",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.9,
    reviewCount: 48,
    stock: 14,
    sizes: ["Free Size"],
    colors: ["Blush Pink", "Crimson Red", "Royal Peacock Blue"],
    fabric: "Pure Mulberry Silk Blend with Golden Zari",
    pattern: "Traditional Temple Motif with Heavy Pallu",
    fit: "Draped Regular",
    occasion: "Weddings, Festivals & Special Gatherings",
    care: "Dry Clean Only",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "Woven with utmost precision by seasoned weavers, this Dindigul handloom zari silk saree features lustrous floral booties and an opulent temple border. Comes with an unstitched blouse piece.",
    descriptionTa: "பாரம்பரிய நெசவாளர்களால் மிகுந்த கவனத்துடன் நெய்யப்பட்ட இந்த திண்டுக்கல் கைத்தறி ஜரி பட்டு புடவை, நேர்த்தியான பூ வேலைப்பாடுகளையும் கம்பீரமான பார்டரையும் கொண்டுள்ளது. ரவிக்கை துணியுடன் வருகிறது.",
    isNew: true,
    isFeatured: true,
    isActive: true
  },
  {
    id: "prod-102",
    sku: "VL-KUR-02",
    nameEn: "Floral Cotton Flared Kurti with Dupatta",
    nameTa: "மலர் பிரிண்ட் பருத்தி குர்தி செட்",
    category: "kurtis",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.8,
    reviewCount: 65,
    stock: 22,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Powder Rose", "Mint Sage", "Soft Cream"],
    fabric: "100% Breathable Combed Cotton",
    pattern: "Hand-Block Floral Botanicals",
    fit: "A-Line Flared Fit",
    occasion: "Office Wear, Daily Casual, Outings",
    care: "Gentle Machine Wash with Like Colors",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "Experience all-day breezy comfort with this tailored pure cotton kurti. Detailed with delicate lace borders along the neckline and hem.",
    descriptionTa: "முழு நாளும் இனிமையான குளிர்ச்சியை தரும் தூய பருத்தி குர்தி. கழுத்து மற்றும் கீழ் ஓரங்களில் நேர்த்தியான லேஸ் வேலைப்பாடுகளுடன் தைக்கப்பட்டுள்ளது.",
    isNew: true,
    isFeatured: true,
    isActive: true
  },
  {
    id: "prod-103",
    sku: "VL-DRS-03",
    nameEn: "Embroidered Georgette Anarkali Gown",
    nameTa: "எம்பிராய்டரி ஜார்ஜெட் அனார்கலி உடை",
    category: "dresses",
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    rating: 4.7,
    reviewCount: 39,
    stock: 8,
    sizes: ["M", "L", "XL"],
    colors: ["Dusty Peach", "Lavender Bloom", "Emerald Jade"],
    fabric: "Flowy Micro-Georgette with Shantoon Lining",
    pattern: "Sequin Thread Embroidery Work",
    fit: "Floor Length Empire Waist",
    occasion: "Reception, Parties, Festivals",
    care: "Dry Clean Recommended",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "Stunning floor-length Anarkali silhouette created for evening festivities. Features subtle sequin highlights that shimmer naturally under ambient light.",
    descriptionTa: "மாலை நேர விழாக்கள் மற்றும் திருமண வரவேற்புகளுக்கு ஏற்ற பிரம்மாண்ட அனார்கலி கவுன். மெல்லிய ஜிலுஜிலுக்கும் வேலைப்பாடுகளுடன் அழகூட்டுகிறது.",
    isNew: false,
    isFeatured: true,
    isActive: true
  },
  {
    id: "prod-104",
    sku: "VL-TOP-04",
    nameEn: "Contemporary Pleated Peplum Top",
    nameTa: "நவீன பெப்ளம் காட்டன் டாப்",
    category: "tops",
    price: 749,
    originalPrice: 1099,
    discount: 31,
    rating: 4.6,
    reviewCount: 27,
    stock: 19,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory Vanilla", "Coral Bloom", "Navy Ink"],
    fabric: "Linen-Cotton Soft Weave",
    pattern: "Solid Minimal with Waist Cinch",
    fit: "Relaxed Fit Peplum",
    occasion: "College, Workwear, Casual Brunch",
    care: "Cold Wash, Low Tumble Dry",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "A minimalist peplum silhouette that transitions effortlessly from morning meetings to weekend coffee outings. Pair with trousers or denim.",
    descriptionTa: "அலுவலகம் மற்றும் அன்றாட பயன்பாட்டிற்கு ஏற்ற அழகான நவீன டாப். பேன்ட் அல்லது ஜீன்சுடன் அழகாக பொருந்தும்.",
    isNew: true,
    isFeatured: false,
    isActive: true
  },
  {
    id: "prod-105",
    sku: "VL-LEG-05",
    nameEn: "Ultra-Stretch 4-Way Organic Cotton Leggings",
    nameTa: "4-வழி ஸ்ட்ரெட்ச் பருத்தி லெக்கின்ஸ்",
    category: "leggings",
    price: 499,
    originalPrice: 799,
    discount: 37,
    rating: 4.9,
    reviewCount: 92,
    stock: 50,
    sizes: ["Free Size (S-XL)", "Plus Size (2XL-4XL)"],
    colors: ["Churidar Black", "Ruby Red", "Deep Maroon", "Golden Skin"],
    fabric: "95% Combed Cotton + 5% Spandex Elastane",
    pattern: "Solid Ultra-Opaque Finish",
    fit: "Skinny Ankle & Churidar Length",
    occasion: "All Day Comfort, Kurti Bottom",
    care: "Machine Wash Cold",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "Designed for premium opacity and zero color fading. Features anti-pilling bio-washed cotton with high waist elastic waistband.",
    descriptionTa: "வண்ணம் மங்காத, மென்மையான 4-வழி ஸ்ட்ரெட்ச் பருத்தி லெக்கின்ஸ். அனைத்து குர்திகளுக்கும் ஏற்ற உயர் தரம்.",
    isNew: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "prod-106",
    sku: "VL-SAR-06",
    nameEn: "Chettinad Cotton Saree with Contrast Border",
    nameTa: "செட்டிநாடு பாரம்பரிய காட்டன் புடவை",
    category: "sarees",
    price: 1499,
    originalPrice: 2199,
    discount: 31,
    rating: 4.8,
    reviewCount: 54,
    stock: 16,
    sizes: ["Free Size (6.3m with Blouse)"],
    colors: ["Mustard Yellow & Maroon", "Peacock Green & Red", "Indigo Blue"],
    fabric: "100% Pure 80s Count Cotton",
    pattern: "Authentic Chettinad Geometric Stripes",
    fit: "Crisp Graceful Drape",
    occasion: "Pooja, Traditional Gatherings, Daily Elegance",
    care: "Hand wash separately in mild shampoo",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    ],
    descriptionEn: "Handcrafted using traditional looms, featuring vibrant contrast border and earthy organic vegetable dye tones.",
    descriptionTa: "பாரம்பரிய கைத்தறியில் நெய்யப்பட்ட சுத்தமான 80s காட்டன் புடவை. இயற்கையான சாயங்கள் மற்றும் கவர்ச்சிகரமான பார்டருடன் வருகிறது.",
    isNew: true,
    isFeatured: true,
    isActive: true
  }
];

export const initialCoupons = [
  {
    id: "cp-1",
    code: "VASTRA10",
    discountPercent: 10,
    maxDiscount: 500,
    minOrderValue: 999,
    isActive: true,
    descriptionEn: "Flat 10% OFF on all orders above ₹999",
    descriptionTa: "₹999-க்கு மேல் 10% தள்ளுபடி"
  },
  {
    id: "cp-2",
    code: "DINDIGULSPECIAL",
    discountPercent: 15,
    maxDiscount: 800,
    minOrderValue: 1999,
    isActive: true,
    descriptionEn: "Special 15% OFF for Festive Season",
    descriptionTa: "பண்டிகை கால சிறப்பு 15% தள்ளுபடி"
  },
  {
    id: "cp-3",
    code: "FIRSTORDER",
    discountAmount: 150,
    discountPercent: 0,
    maxDiscount: 150,
    minOrderValue: 799,
    isActive: true,
    descriptionEn: "Flat ₹150 OFF on your first purchase",
    descriptionTa: "முதல் ஆர்டருக்கு ₹150 தள்ளுபடி"
  }
];

export const initialBanners = [
  {
    id: "ban-1",
    titleEn: "The Royal Dindigul Silk Collection",
    titleTa: "திண்டுக்கல்லின் பிரம்மாண்ட பட்டு புடவைகள்",
    subtitleEn: "Handpicked Mulberry Silks & Pure Cotton Sarees for Festive Occasions",
    subtitleTa: "பண்டிகைக்கு ஏற்ற தூய பட்டு மற்றும் பருத்தி சேலைகள்",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
    buttonTextEn: "Shop Sarees",
    buttonTextTa: "புடவைகளை காண்க",
    targetCategory: "sarees",
    isActive: true
  },
  {
    id: "ban-2",
    titleEn: "Summer Breezy Kurtis & Sets",
    titleTa: "கோடைக்கால நேர்த்தி குர்தி செட்ஸ்",
    subtitleEn: "Pure 100% Breathable Cotton crafted with love",
    subtitleTa: "100% தூய பருத்தி துணியில் உருவாக்கப்பட்ட குர்திகள்",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
    buttonTextEn: "Explore Kurtis",
    buttonTextTa: "குர்திகளை காண்க",
    targetCategory: "kurtis",
    isActive: true
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    productId: "prod-101",
    author: "Kavitha Sundaram",
    city: "Dindigul",
    rating: 5,
    date: "2026-08-20",
    commentEn: "The zari work is so delicate and graceful! Everyone at the wedding complimented the saree. Proud of our Dindigul craftsmanship!",
    commentTa: "ஜரி வேலைப்பாடு மிகவும் நேர்த்தியாக உள்ளது! திருமண விழாவில் அனைவரும் பாராட்டினார்கள். திண்டுக்கல் கைத்தறிக்கு பெருமை!"
  },
  {
    id: "rev-2",
    productId: "prod-102",
    author: "Deepa Rajan",
    city: "Chennai",
    rating: 5,
    date: "2026-08-24",
    commentEn: "Extremely soft fabric, fits true to size. Delivered in just 2 days. WhatsApp support was very helpful in sizing!",
    commentTa: "துணி மிகவும் மிருதுவாக உள்ளது, அளவு சரியாக பொருந்துகிறது. 2 நாட்களில் டெலிவரி செய்யப்பட்டது. வாட்ஸ்அப் உதவி மிகவும் பயனுள்ளதாக இருந்தது!"
  }
];
