export interface Salon {
  id: string;
  name: string;
  area: string;
  tags: string[];
  rating: number;
  reviews: number;
  priceRange: string;
  bestFor: string;
  image: string;
  address: string;
  timing: string;
  desc: string;
  services: { name: string; price: string; duration: string }[];
}

const pexelsImages = [
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4587987/pexels-photo-4587987.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3754288/pexels-photo-3754288.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3764568/pexels-photo-3764568.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3984225/pexels-photo-3984225.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738373/pexels-photo-3738373.jpeg?auto=compress&cs=tinysrgb&w=800"
];

function getRandomImage(index: number) {
  return ""; // will be replaced
}

const rawSalonsData: Salon[] = [
  {
    id: "cp-1",
    name: "Looks Salon",
    area: "Connaught Place",
    tags: ["Hair", "Skin", "Bridal"],
    rating: 4.5,
    reviews: 320,
    priceRange: "₹800-₹5000",
    bestFor: "Bridal makeup, hair spa, skin treatments",
    image: getRandomImage(0),
    address: "N-14 Connaught Place, New Delhi",
    timing: "10:00 AM - 9:00 PM",
    desc: "Renowned for its excellent customer service and premium beauty treatments, Looks Salon in CP is an iconic destination for complete transformation.",
    services: [
      { name: "Bridal Makeup", price: "₹20,000", duration: "120 mins" },
      { name: "Hair Spa", price: "₹1,500", duration: "45 mins" },
      { name: "Skin Rejuvenation", price: "₹4,000", duration: "60 mins" }
    ]
  },
  {
    id: "cp-2",
    name: "Enrich Salon",
    area: "Connaught Place",
    tags: ["Hair", "Facials"],
    rating: 4.3,
    reviews: 215,
    priceRange: "₹1000-₹4000",
    bestFor: "Hair color, smoothening",
    image: getRandomImage(1),
    address: "A-16 Inner Circle, Connaught Place",
    timing: "10:30 AM - 8:30 PM",
    desc: "Bringing advanced hair care techniques and glowing facials to the heart of the city.",
    services: [
      { name: "Hair Color", price: "₹3,500", duration: "90 mins" },
      { name: "Keratin Treatment", price: "₹4,000", duration: "180 mins" },
      { name: "Classic Facial", price: "₹1,500", duration: "45 mins" }
    ]
  },
  {
    id: "cp-3",
    name: "Naturals Salon",
    area: "Connaught Place",
    tags: ["Skin", "Bridal", "Hair"],
    rating: 4.2,
    reviews: 180,
    priceRange: "₹600-₹3500",
    bestFor: "Natural hair care, bridal packages",
    image: getRandomImage(2),
    address: "Janpath, Connaught Place",
    timing: "09:30 AM - 9:00 PM",
    desc: "An eco-conscious salon using natural ingredients to bring out your best self without harsh chemicals.",
    services: [
      { name: "Organic Hair Spa", price: "₹1,200", duration: "45 mins" },
      { name: "Pre-Bridal Package", price: "₹8,000", duration: "180 mins" }
    ]
  },
  {
    id: "cp-4",
    name: "Affinity Salon",
    area: "Connaught Place",
    tags: ["Hair", "Skin", "Nails"],
    rating: 4.6,
    reviews: 405,
    priceRange: "₹1200-₹6000",
    bestFor: "Luxury hair treatments, nail art",
    image: getRandomImage(3),
    address: "Connaught Lane, CP",
    timing: "10:00 AM - 9:00 PM",
    desc: "A luxury salon providing state-of-the-art nail art and ultra-premium hair care services.",
    services: [
      { name: "Luxury Hair Treatment", price: "₹4,500", duration: "60 mins" },
      { name: "Gel Nail Extensions", price: "₹2,500", duration: "90 mins" }
    ]
  },
  {
    id: "cp-5",
    name: "Green Trends",
    area: "Connaught Place",
    tags: ["Hair", "Skin"],
    rating: 4.1,
    reviews: 154,
    priceRange: "₹700-₹3000",
    bestFor: "Organic treatments, sensitive skin",
    image: getRandomImage(4),
    address: "Connaught Place",
    timing: "10:00 AM - 8:00 PM",
    desc: "Focusing on wellness-first approaches with skin-safe herbal treatments.",
    services: [
      { name: "Sensitive Skin Facial", price: "₹1,800", duration: "50 mins" },
      { name: "Herbal Hair Spa", price: "₹1,000", duration: "45 mins" }
    ]
  },
  {
    id: "cp-6",
    name: "VLCC Wellness",
    area: "Connaught Place",
    tags: ["Skin", "Bridal", "Body"],
    rating: 4.4,
    reviews: 290,
    priceRange: "₹1500-₹8000",
    bestFor: "Bridal glow packages, skin whitening",
    image: getRandomImage(5),
    address: "Outer Circle CP",
    timing: "09:00 AM - 9:00 PM",
    desc: "A holistic hub for body wellness, weight management, and intensive bridal prep.",
    services: [
      { name: "Bridal Glow Therapy", price: "₹5,000", duration: "90 mins" },
      { name: "Body Detox Massage", price: "₹3,500", duration: "60 mins" }
    ]
  },
  {
    id: "cp-7",
    name: "Lakmé Salon",
    area: "Connaught Place",
    tags: ["Bridal", "Hair"],
    rating: 4.5,
    reviews: 512,
    priceRange: "₹1000-₹7000",
    bestFor: "Bridal makeup, party makeup",
    image: getRandomImage(6),
    address: "H Block Connaught Place",
    timing: "10:00 AM - 9:00 PM",
    desc: "India's beloved beauty brand offering flawless runway-ready makeup looks and sophisticated styling.",
    services: [
      { name: "Signature Bridal Makeup", price: "₹15,000", duration: "120 mins" },
      { name: "HD Party Makeup", price: "₹4,500", duration: "60 mins" }
    ]
  },
  {
    id: "cp-8",
    name: "YLG Salon",
    area: "Connaught Place",
    tags: ["Hair", "Skin", "Grooming"],
    rating: 4.2,
    reviews: 130,
    priceRange: "₹500-₹2500",
    bestFor: "Quick grooming, hair styling",
    image: getRandomImage(7),
    address: "Barakhamba Road CP",
    timing: "10:00 AM - 8:30 PM",
    desc: "Perfect for on-the-go professionals looking for quick, high-quality grooming and styling.",
    services: [
      { name: "Advanced Hair Styling", price: "₹1,200", duration: "30 mins" },
      { name: "Express Grooming Package", price: "₹1,500", duration: "45 mins" }
    ]
  },
  {
    id: "ro-1",
    name: "Jawed Habib",
    area: "Rohini",
    tags: ["Hair", "Grooming"],
    rating: 4.3,
    reviews: 410,
    priceRange: "₹400-₹3000",
    bestFor: "Haircuts, hair color, mens grooming",
    image: getRandomImage(0),
    address: "Rohini Sector 10",
    timing: "10:00 AM - 9:00 PM",
    desc: "Masterful hair cutting and modern coloring techniques from the nation's premier hair artistry brand.",
    services: [
      { name: "Creative Haircut & Wash", price: "₹700", duration: "45 mins" },
      { name: "Global Hair Color", price: "₹2,500", duration: "90 mins" }
    ]
  },
  {
    id: "ro-2",
    name: "Looks Salon Rohini",
    area: "Rohini",
    tags: ["Bridal", "Hair", "Skin"],
    rating: 4.4,
    reviews: 265,
    priceRange: "₹800-₹5000",
    bestFor: "Bridal packages, party makeup",
    image: getRandomImage(1),
    address: "Sector 7 Rohini",
    timing: "10:00 AM - 8:30 PM",
    desc: "Bringing CP-level luxury back to North Delhi, specialising in immersive bridal packages.",
    services: [
      { name: "Airbrush Bridal Package", price: "₹18,000", duration: "120 mins" },
      { name: "Party Makeup", price: "₹4,000", duration: "60 mins" }
    ]
  },
  {
    id: "ro-3",
    name: "Naturals Rohini",
    area: "Rohini",
    tags: ["Hair", "Skin"],
    rating: 4.1,
    reviews: 95,
    priceRange: "₹500-₹2500",
    bestFor: "Hair spa, natural facials",
    image: getRandomImage(2),
    address: "Sector 11 Rohini",
    timing: "09:30 AM - 8:30 PM",
    desc: "Calming botanical treatments focused on rejuvenation and chemical-free wellness.",
    services: [
      { name: "Botanical Hair Spa", price: "₹1,000", duration: "45 mins" },
      { name: "Fruit Care Facial", price: "₹1,200", duration: "50 mins" }
    ]
  },
  {
    id: "ro-4",
    name: "Affinity Rohini",
    area: "Rohini",
    tags: ["Hair", "Nails"],
    rating: 4.3,
    reviews: 180,
    priceRange: "₹900-₹4000",
    bestFor: "Keratin treatment, nail extensions",
    image: getRandomImage(3),
    address: "Sector 14 Rohini",
    timing: "10:00 AM - 9:00 PM",
    desc: "Expert stylists delivering picture-perfect nail artistry and long-lasting hair smoothening.",
    services: [
      { name: "Brazilian Keratin", price: "₹3,500", duration: "120 mins" },
      { name: "Acrylic Nail Extensions", price: "₹2,000", duration: "60 mins" }
    ]
  },
  {
    id: "ro-5",
    name: "Glamour Studio",
    area: "Rohini",
    tags: ["Bridal", "Mehendi"],
    rating: 4.5,
    reviews: 210,
    priceRange: "₹2000-₹15000",
    bestFor: "Full bridal packages, mehendi, pre-bridal",
    image: getRandomImage(4),
    address: "Sector 9 Rohini",
    timing: "11:00 AM - 8:00 PM",
    desc: "The bridal dream destination offering an all-inclusive glamour experience, from Mehendi to Reception styling.",
    services: [
      { name: "Royal Bridal Package", price: "₹14,000", duration: "180 mins" },
      { name: "Bridal Mehendi", price: "₹3,000", duration: "90 mins" }
    ]
  },
  {
    id: "ro-6",
    name: "Pink Root Salon",
    area: "Rohini",
    tags: ["Hair", "Skin", "Bridal"],
    rating: 4.2,
    reviews: 110,
    priceRange: "₹600-₹4000",
    bestFor: "Hair treatments, bridal makeup",
    image: getRandomImage(5),
    address: "Sector 13 Rohini",
    timing: "10:00 AM - 8:00 PM",
    desc: "A boutique space celebrating modern beauty through personalised skin and hair plans.",
    services: [
      { name: "Advanced Hair Recovery", price: "₹2,500", duration: "60 mins" },
      { name: "Signature Glow Makeup", price: "₹6,000", duration: "60 mins" }
    ]
  },
  {
    id: "ro-7",
    name: "Studio 11 Salon",
    area: "Rohini",
    tags: ["Hair", "Skin"],
    rating: 4.0,
    reviews: 145,
    priceRange: "₹500-₹3000",
    bestFor: "Hair styling, facials",
    image: getRandomImage(6),
    address: "Sector 11 Rohini",
    timing: "10:00 AM - 8:30 PM",
    desc: "Contemporary, fast, and highly reliable. Ideal for immediate makeovers and vibrant hair styling.",
    services: [
      { name: "Trendy Hair Styling", price: "₹800", duration: "30 mins" },
      { name: "Deep Clarifying Facial", price: "₹1,500", duration: "45 mins" }
    ]
  },
  {
    id: "ro-8",
    name: "Scissors & Shades",
    area: "Rohini",
    tags: ["Hair"],
    rating: 4.4,
    reviews: 205,
    priceRange: "₹1000-₹5000",
    bestFor: "Balayage, highlights, color correction",
    image: getRandomImage(7),
    address: "Sector 16 Rohini",
    timing: "10:30 AM - 9:00 PM",
    desc: "Specialty colorhouse for flawless balayage, intense highlights, and master-level color correction.",
    services: [
      { name: "Bespoke Balayage", price: "₹4,500", duration: "120 mins" },
      { name: "Color Correction Therapy", price: "₹3,000", duration: "90 mins" }
    ]
  },
  {
    id: "sd-1",
    name: "Lakmé Salon GK",
    area: "South Delhi",
    tags: ["Bridal", "Hair"],
    rating: 4.6,
    reviews: 350,
    priceRange: "₹1500-₹8000",
    bestFor: "Celebrity makeup, bridal packages",
    image: getRandomImage(0),
    address: "Greater Kailash 1, South Delhi",
    timing: "10:00 AM - 9:00 PM",
    desc: "Elite makeup artists delivering celebrity-inspired looks right in the posh GK neighbourhood.",
    services: [
      { name: "Celebrity Bridal Lookup", price: "₹25,000", duration: "180 mins" },
      { name: "Red Carpet Styling", price: "₹4,000", duration: "60 mins" }
    ]
  },
  {
    id: "sd-2",
    name: "Bodycraft Salon",
    area: "South Delhi",
    tags: ["Skin", "Hair", "Body"],
    rating: 4.5,
    reviews: 420,
    priceRange: "₹1200-₹6000",
    bestFor: "Skin rejuvenation, hair spa",
    image: getRandomImage(1),
    address: "Saket, South Delhi",
    timing: "09:30 AM - 9:00 PM",
    desc: "A clinical-yet-luxurious oasis meant to completely heal and restore body and skin vitality.",
    services: [
      { name: "Dermalogical Rejuvenation", price: "₹5,000", duration: "60 mins" },
      { name: "Moroccan Oil Hair Spa", price: "₹2,500", duration: "50 mins" }
    ]
  },
  {
    id: "sd-3",
    name: "Enrich Salon Lajpat",
    area: "South Delhi",
    tags: ["Hair", "Bridal", "Nails"],
    rating: 4.3,
    reviews: 220,
    priceRange: "₹1000-₹5000",
    bestFor: "Nail art, hair color, bridal",
    image: getRandomImage(2),
    address: "Lajpat Nagar 2, South Delhi",
    timing: "10:00 AM - 8:30 PM",
    desc: "Premium beauty nestled in a vibrant shopping hub, perfecting vivid hair colors and stunning nails.",
    services: [
      { name: "Vivid Fashion Color", price: "₹4,000", duration: "120 mins" },
      { name: "Bridal Nail Extensions", price: "₹2,500", duration: "90 mins" }
    ]
  },
  {
    id: "sd-4",
    name: "Jean Claude Biguine",
    area: "South Delhi",
    tags: ["Hair", "Skin"],
    rating: 4.7,
    reviews: 505,
    priceRange: "₹2000-₹12000",
    bestFor: "Luxury hair treatments, premium bridal",
    image: getRandomImage(3),
    address: "Defence Colony, South Delhi",
    timing: "10:00 AM - 9:00 PM",
    desc: "Authentic French salons weaving international chic straight into the fabric of Delhi's elite.",
    services: [
      { name: "Parisian Cut & Styling", price: "₹3,500", duration: "45 mins" },
      { name: "Gold Radiance Facial", price: "₹6,000", duration: "60 mins" }
    ]
  },
  {
    id: "sd-5",
    name: "Strands Salon",
    area: "South Delhi",
    tags: ["Hair"],
    rating: 4.5,
    reviews: 215,
    priceRange: "₹1500-₹7000",
    bestFor: "Creative cuts, balayage, fashion color",
    image: getRandomImage(4),
    address: "Hauz Khas Village, South Delhi",
    timing: "11:00 AM - 9:00 PM",
    desc: "The edgy, artistic hub in HKV where avant-garde haircuts meet fashion-forward coloring.",
    services: [
      { name: "Creative Hair Architecture", price: "₹2,500", duration: "60 mins" },
      { name: "Avant-Garde Color", price: "₹5,500", duration: "120 mins" }
    ]
  },
  {
    id: "sd-6",
    name: "Mirrors Salon",
    area: "South Delhi",
    tags: ["Bridal", "Skin", "Hair"],
    rating: 4.6,
    reviews: 310,
    priceRange: "₹2000-₹10000",
    bestFor: "High-end bridal, luxury facials",
    image: getRandomImage(5),
    address: "Saket Select Citywalk, South Delhi",
    timing: "10:30 AM - 9:30 PM",
    desc: "After shopping, unwind in one of Delhi's most opulent salons tailored for indulgence.",
    services: [
      { name: "Luxury Oxygen Facial", price: "₹4,500", duration: "60 mins" },
      { name: "Premium Bridal Prep", price: "₹12,000", duration: "150 mins" }
    ]
  },
  {
    id: "sd-7",
    name: "Gloss Salon",
    area: "South Delhi",
    tags: ["Hair", "Skin", "Grooming", "Nails"],
    rating: 4.2,
    reviews: 140,
    priceRange: "₹600-₹3500",
    bestFor: "Everyday grooming, quick services",
    image: getRandomImage(6),
    address: "Green Park, South Delhi",
    timing: "10:00 AM - 8:00 PM",
    desc: "Crisp, clean, and effortlessly chic. The daily stop for professionals who demand consistent polish.",
    services: [
      { name: "Express Blowout", price: "₹800", duration: "30 mins" },
      { name: "Quick Glow Facial", price: "₹1,200", duration: "40 mins" }
    ]
  },
  {
    id: "sd-8",
    name: "Juice Salon",
    area: "South Delhi",
    tags: ["Hair"],
    rating: 4.4,
    reviews: 290,
    priceRange: "₹1200-₹6000",
    bestFor: "Hair transformation, color correction",
    image: getRandomImage(7),
    address: "Vasant Kunj, South Delhi",
    timing: "10:00 AM - 8:30 PM",
    desc: "Hair transformation specialists with a cult following for producing seamless, damage-free balayages.",
    services: [
      { name: "Flawless Balayage", price: "₹5,000", duration: "120 mins" },
      { name: "Olaplex Core Treatment", price: "₹3,500", duration: "60 mins" }
    ]
  },
  {
    id: "sd-9",
    name: "Toni and Guy",
    area: "South Delhi",
    tags: ["Hair"],
    rating: 4.7,
    reviews: 640,
    priceRange: "₹2500-₹15000",
    bestFor: "Premium cuts, international styling",
    image: getRandomImage(0),
    address: "Khan Market, South Delhi",
    timing: "10:00 AM - 8:30 PM",
    desc: "A globally revered institution offering London's high-fashion styling right in Delhi's most elite market.",
    services: [
      { name: "Senior Director Cut", price: "₹4,000", duration: "60 mins" },
      { name: "Editorial Styling", price: "₹6,000", duration: "60 mins" }
    ]
  }
];

export const salonsData: Salon[] = rawSalonsData.map((salon, index) => ({
  ...salon,
  image: pexelsImages[index % pexelsImages.length]
}));
