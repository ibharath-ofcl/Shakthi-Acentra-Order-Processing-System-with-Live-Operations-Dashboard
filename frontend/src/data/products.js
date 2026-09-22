// Shakthi-Acentra: Medical Products Catalog
// Integrated with live backend inventory SKUs and real commercial product imagery

export const MEDICAL_CATEGORIES = [
  { id: 'all', name: 'All Products', count: 8, image: '/images/products/pulse-oximeter.jpg' },
  { id: 'diagnostics', name: 'Diagnostics', count: 2, icon: 'Activity', image: '/images/products/pulse-oximeter.jpg' },
  { id: 'monitoring', name: 'Monitoring', count: 1, icon: 'HeartPulse', image: '/images/products/blood-pressure-monitor.jpg' },
  { id: 'ppe', name: 'PPE', count: 1, icon: 'ShieldCheck', image: '/images/products/surgical-gloves.jpg' },
  { id: 'consumables', name: 'Consumables', count: 2, icon: 'Package', image: '/images/products/nebulizer.jpg' },
  { id: 'surgical', name: 'Surgical Supplies', count: 1, icon: 'Scissors', image: '/images/products/iv-set.jpg' },
  { id: 'emergency', name: 'Emergency Care', count: 1, icon: 'Cross', image: '/images/products/trauma-kit.jpg' }
];

export const PRODUCTS = [
  {
    id: 1,
    sku: 'MED-OX-201',
    name: 'Pulse Oximeter Pro',
    category: 'diagnostics',
    categoryName: 'Diagnostics',
    price: 1499.00,
    rating: 4.9,
    reviewsCount: 142,
    image: '/images/products/pulse-oximeter.jpg',
    shortDescription: 'Medical-grade fingertip pulse oximeter with dual-color OLED perfusion display.',
    description: 'The Shakthi Pulse Oximeter Pro delivers hospital-grade precision for non-invasive SpO2 oxygen saturation and pulse rate monitoring. Built with anti-motion algorithms and an ultra-low-power OLED display.',
    features: [
      'Dual-color OLED multidirectional display with perfusion index (PI)',
      'Clinical accuracy within ±2% (70% - 100% SpO2)',
      'Auto-power-off in 8 seconds when finger is removed',
      'Hypoallergenic medical silicone finger chamber',
      'Audible alarm for high/low heart rate and low oxygen saturation'
    ],
    specs: {
      'Measurement Range': 'SpO2: 35% - 100% | Pulse: 25 - 250 bpm',
      'Accuracy': 'SpO2: ±2% (80%-100%) | Pulse: ±2 bpm',
      'Power Source': '2x AAA Alkaline Batteries (30+ hours)',
      'Dimensions': '58 x 32 x 34 mm',
      'Weight': '50g (with batteries)',
      'Certifications': 'Clinical ISO 80601-2-61'
    },
    badge: 'Best Seller',
    defaultStock: 85,
    gradient: 'from-emerald-500 to-teal-700',
    accentColor: '#167733',
    featured: true
  },
  {
    id: 2,
    sku: 'MED-BP-302',
    name: 'Digital Blood Pressure Monitor',
    category: 'monitoring',
    categoryName: 'Monitoring',
    price: 2499.00,
    rating: 4.8,
    reviewsCount: 94,
    image: '/images/products/blood-pressure-monitor.jpg',
    shortDescription: 'Upper-arm clinical blood pressure monitor with arrhythmia detection.',
    description: 'Engineered for clinic and home health monitoring, featuring gentle inflation technology, dual-user 120-reading memory, and instant WHO classification color coding.',
    features: [
      'Gentle+ cuff inflation technology for comfortable readings',
      'Irregular heartbeat (IHB) detection algorithm',
      'Wide-range contoured arm cuff (22 - 42 cm)',
      'Dual user profile memory (60 readings per user with timestamp)',
      'High-contrast backlit LCD with large readable digits'
    ],
    specs: {
      'Pressure Range': '0 - 299 mmHg',
      'Pulse Range': '40 - 199 beats/min',
      'Pressure Accuracy': '±3 mmHg',
      'Cuff Circumference': '22 - 42 cm (Standard to Large adult)',
      'Power Source': '4x AA or AC Adapter included'
    },
    badge: 'Clinician Choice',
    defaultStock: 50,
    gradient: 'from-blue-600 to-indigo-800',
    accentColor: '#0284C7',
    featured: true
  },
  {
    id: 3,
    sku: 'MED-GL-403',
    name: 'Sterile Nitrile Surgical Gloves',
    category: 'ppe',
    categoryName: 'PPE',
    price: 749.00,
    rating: 4.9,
    reviewsCount: 310,
    image: '/images/products/surgical-gloves.jpg',
    shortDescription: 'Powder-free textured surgical gloves (Box of 100 pairs).',
    description: 'Superior barrier protection with micro-textured fingertips for unmatched tactile sensitivity in clinical and surgical procedures. 100% latex-free to eliminate allergic reactions.',
    features: [
      'Latex-free and powder-free 100% pure nitrile compound',
      'Micro-textured fingertips for precise wet and dry instrument grip',
      'Beaded cuff prevents roll-down and facilitates donning',
      'Tested against chemotherapy drug permeation (ASTM D6978)',
      'AQL 1.5 medical examination standard'
    ],
    specs: {
      'Material': 'Medical Grade Nitrile',
      'Thickness': 'Finger: 4.5 mil | Palm: 3.5 mil',
      'Packaging': '100 ambidextrous gloves per dispenser box',
      'Sterility': 'Gamma irradiated sterile pairs',
      'Color': 'Clinical Medical Blue'
    },
    badge: 'High Demand',
    defaultStock: 120,
    gradient: 'from-teal-600 to-cyan-800',
    accentColor: '#0D9488',
    featured: true
  },
  {
    id: 4,
    sku: 'MED-NEB-504',
    name: 'Ultrasonic Mesh Nebulizer',
    category: 'consumables',
    categoryName: 'Consumables',
    price: 1899.00,
    rating: 4.7,
    reviewsCount: 76,
    image: '/images/products/nebulizer.jpg',
    shortDescription: 'Portable clinical aerosol nebulizer for pediatric and adult care.',
    description: 'Pocket-sized vibrating mesh aerosol therapy system. Whisper-quiet operation (<25dB) delivering consistent 2.5 micron aerosol particles directly to the lower respiratory tract.',
    features: [
      'Vibrating titanium mesh produces <3.0 µm MMAD mist',
      'Whisper-silent ultrasonic operation (<25 dB)',
      'Self-cleaning cycle prevents medication residue clogging',
      'Rechargeable Lithium-ion battery via USB-C (2.5 hours runtime)',
      'Includes child mask, adult mask, and angled mouthpiece'
    ],
    specs: {
      'Particle Size': 'MMAD < 3.0 µm',
      'Nebulization Rate': '≥ 0.25 ml/min',
      'Medication Cup': '8 ml capacity',
      'Weight': '98g pocket format',
      'Rechargeable': 'USB-C Fast Charging'
    },
    badge: 'Innovative',
    defaultStock: 40,
    gradient: 'from-emerald-600 to-teal-800',
    accentColor: '#167733',
    featured: true
  },
  {
    id: 5,
    sku: 'MED-TH-605',
    name: 'Clinical Infrared Thermometer',
    category: 'diagnostics',
    categoryName: 'Diagnostics',
    price: 899.00,
    rating: 4.8,
    reviewsCount: 142,
    image: '/images/products/thermometer.jpg',
    shortDescription: 'Non-contact forehead infrared thermometer with 0.1°C accuracy.',
    description: 'Instant 1-second temperature readouts from 1-3 cm distance. German-engineered thermopile sensor with ambient temperature compensation algorithm for high triage reliability.',
    features: [
      'Instant 1-second clinical measurement without skin contact',
      'High-precision German Heimann infrared sensor',
      '3-color fever alert LED (Green, Amber, Red)',
      'Internal memory saves 32 recent temperature logs',
      'Switchable forehead, surface, and room mode'
    ],
    specs: {
      'Measuring Distance': '1 - 3 cm',
      'Clinical Accuracy': '±0.2°C (35.0°C - 42.0°C)',
      'Response Time': '< 1.0 second',
      'Memory': '32 temperature reading sets',
      'Auto Shutoff': '15 seconds standby'
    },
    badge: 'Popular',
    defaultStock: 65,
    gradient: 'from-amber-600 to-orange-800',
    accentColor: '#D97706',
    featured: true
  },
  {
    id: 6,
    sku: 'MED-IV-706',
    name: 'Sterile Luer-Lock IV Set',
    category: 'surgical',
    categoryName: 'Surgical Supplies',
    price: 349.00,
    rating: 4.9,
    reviewsCount: 88,
    image: '/images/products/iv-set.jpg',
    shortDescription: 'Gravity infusion administration set with 15-micron fluid filter.',
    description: 'Universal vented spike and gravity flow administration set with precise roller clamp and anti-kink clear tubing. Equipped with a needle-free Y-injection site and rotating Luer-lock collar.',
    features: [
      'Universal vented spike suitable for flexible infusion bags and glass bottles',
      'Integrated 15-micron fluid filter prevents particulate entry',
      'Micro-roller clamp for fine-tuned drip rate calibration',
      'Latex-free self-sealing needleless Y-injection port',
      'Non-pyrogenic, sterile blister packaging'
    ],
    specs: {
      'Drop Factor': '20 drops/ml',
      'Tubing Length': '180 cm kink-resistant PVC',
      'Filter Pore': '15 micron fluid filtration',
      'Connector': 'Male rotating Luer Lock with protective cap',
      'Shelf Life': '5 Years Sterile'
    },
    badge: 'Essential',
    defaultStock: 90,
    gradient: 'from-blue-700 to-cyan-900',
    accentColor: '#0284C7',
    featured: true
  },
  {
    id: 7,
    sku: 'MED-FA-807',
    name: 'Emergency Trauma Responder Kit',
    category: 'emergency',
    categoryName: 'Emergency Care',
    price: 4999.00,
    rating: 5.0,
    reviewsCount: 53,
    image: '/images/products/trauma-kit.jpg',
    shortDescription: 'Comprehensive rapid trauma medical kit for EMS and acute triage.',
    description: 'Field-ready tactical medical kit packed in high-visibility 1000D ballistic nylon. Contains combat tourniquet, chest seals, hemostatic gauze, trauma shears, and emergency airway guides.',
    features: [
      'Combat tourniquet with aluminum windlass',
      'Vented chest seal twin-pack for penetrating chest trauma',
      'Hemostatic combat dressing and pressure bandage',
      'Heavy-duty titanium-coated trauma shears (7.5 inch)',
      'MOLLE-compatible rip-away rapid deployment pouch'
    ],
    specs: {
      'Pouch Material': 'Water-resistant 1000D Cordura Nylon',
      'Item Count': '38 acute trauma components',
      'Weight': '1.2 kg field weight',
      'Dimensions': '22 x 16 x 10 cm'
    },
    badge: 'Critical Care',
    defaultStock: 30,
    gradient: 'from-rose-600 to-red-800',
    accentColor: '#BE123C',
    featured: false
  },
  {
    id: 8,
    sku: 'MED-SYR-908',
    name: 'Precision Safety Syringes 3ml',
    category: 'consumables',
    categoryName: 'Consumables',
    price: 299.00,
    rating: 4.8,
    reviewsCount: 115,
    image: '/images/products/syringes.jpg',
    shortDescription: 'Retractable needle safety syringes, sterile (Pack of 50).',
    description: 'Active safety mechanism automatically retracts the needle directly into the plunger upon completion of injection, virtually eliminating accidental needle-stick injuries.',
    features: [
      'Integrated active needle retraction prevents accidental needlesticks',
      'Ultra-sharp tri-beveled stainless steel needle with silicone lubricant',
      'Crystal-clear polypropylene barrel with bold scale markings',
      'Minimum dead space design reduces medication loss',
      'Individually sterile peel-pack wrapped'
    ],
    specs: {
      'Capacity': '3.0 ml (0.1 ml graduations)',
      'Needle Gauge': '22G x 1.5 inch',
      'Safety Type': 'Plunger-activated needle retraction',
      'Quantity': '50 safety syringes per box'
    },
    badge: 'Clinical Grade',
    defaultStock: 150,
    gradient: 'from-emerald-700 to-teal-900',
    accentColor: '#167733',
    featured: false
  }
];
