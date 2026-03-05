// ─── PLOTS DATA ───────────────────────────────────────────────────────────────
export const PLOTS = [
  // Row 1
  { id:101, x:-180, z:-160, w:40, d:30, status:"available", facing:"East",  price:"₹24,00,000", sqft:1200 },
  { id:102, x:-130, z:-160, w:40, d:30, status:"sold",      facing:"East",  price:"₹26,00,000", sqft:1200 },
  { id:103, x:-80,  z:-160, w:40, d:30, status:"reserved",  facing:"East",  price:"₹28,00,000", sqft:1200 },
  { id:104, x:-30,  z:-160, w:40, d:30, status:"available", facing:"East",  price:"₹25,00,000", sqft:1200 },
  { id:105, x:20,   z:-160, w:40, d:30, status:"available", facing:"East",  price:"₹27,00,000", sqft:1200 },
  { id:106, x:70,   z:-160, w:40, d:30, status:"sold",      facing:"East",  price:"₹29,00,000", sqft:1200 },
  { id:107, x:120,  z:-160, w:40, d:30, status:"available", facing:"East",  price:"₹26,50,000", sqft:1200 },
  { id:108, x:170,  z:-160, w:40, d:30, status:"reserved",  facing:"East",  price:"₹30,00,000", sqft:1200 },
  // Row 2
  { id:201, x:-180, z:-100, w:40, d:30, status:"available", facing:"North", price:"₹22,00,000", sqft:1200 },
  { id:202, x:-130, z:-100, w:40, d:30, status:"available", facing:"North", price:"₹23,00,000", sqft:1200 },
  { id:203, x:-80,  z:-100, w:40, d:30, status:"sold",      facing:"North", price:"₹25,00,000", sqft:1200 },
  { id:204, x:-30,  z:-100, w:40, d:30, status:"available", facing:"North", price:"₹24,00,000", sqft:1200 },
  { id:205, x:20,   z:-100, w:40, d:30, status:"reserved",  facing:"North", price:"₹26,00,000", sqft:1200 },
  { id:206, x:70,   z:-100, w:40, d:30, status:"available", facing:"North", price:"₹28,00,000", sqft:1200 },
  { id:207, x:120,  z:-100, w:40, d:30, status:"available", facing:"North", price:"₹27,00,000", sqft:1200 },
  { id:208, x:170,  z:-100, w:40, d:30, status:"sold",      facing:"North", price:"₹31,00,000", sqft:1200 },
  // Row 3
  { id:301, x:-180, z:-30,  w:40, d:30, status:"sold",      facing:"West",  price:"₹20,00,000", sqft:1200 },
  { id:302, x:-130, z:-30,  w:40, d:30, status:"available", facing:"West",  price:"₹21,00,000", sqft:1200 },
  { id:303, x:-80,  z:-30,  w:40, d:30, status:"available", facing:"West",  price:"₹23,00,000", sqft:1200 },
  { id:304, x:-30,  z:-30,  w:40, d:30, status:"reserved",  facing:"West",  price:"₹22,00,000", sqft:1200 },
  { id:305, x:20,   z:-30,  w:40, d:30, status:"available", facing:"West",  price:"₹24,00,000", sqft:1200 },
  { id:306, x:70,   z:-30,  w:40, d:30, status:"available", facing:"West",  price:"₹26,00,000", sqft:1200 },
  { id:307, x:120,  z:-30,  w:40, d:30, status:"sold",      facing:"West",  price:"₹25,00,000", sqft:1200 },
  { id:308, x:170,  z:-30,  w:40, d:30, status:"available", facing:"West",  price:"₹29,00,000", sqft:1200 },
];

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
export const STATUS_COLOR  = { available:"#d4af37", sold:"#c0392b", reserved:"#8e8e8e" };
export const STATUS_HEX3   = { available:0xd4af37,  sold:0xc0392b,  reserved:0x8e8e8e  };
export const STATUS_BG     = { available:"rgba(212,175,55,0.12)", sold:"rgba(192,57,43,0.12)", reserved:"rgba(142,142,142,0.10)" };

// ─── ROOMS DEFINITION ─────────────────────────────────────────────────────────
// Each room has furniture items and description for the interior view
const ROOMS_2BHK = [
  {
    id:"living", name:"Living Room",
    icon:"🛋",
    size:"14 × 12 ft", area:"168 sq ft",
    desc:"Spacious living room with floor-to-ceiling windows, premium marble flooring, and elegant crown moulding.",
    color:"#1a1200",
    furniture:[
      { type:"sofa",   x:-2,  z:1,  w:5, h:0.8, d:2.2, color:0x2c2c2c, label:"L-Sofa"  },
      { type:"table",  x:0,   z:-1, w:2.5,h:0.4,d:1.5, color:0xb8960c, label:"Coffee Table" },
      { type:"tv",     x:0,   z:4,  w:4, h:2,   d:0.2, color:0x111111, label:"85\" TV"  },
      { type:"plant",  x:3.5, z:3,  w:0.6,h:1.8,d:0.6, color:0x2d5a27, label:"Plant"   },
      { type:"lamp",   x:-4,  z:3,  w:0.3,h:1.6,d:0.3, color:0xd4af37, label:"Lamp"    },
    ]
  },
  {
    id:"kitchen", name:"Kitchen",
    icon:"🍳",
    size:"10 × 8 ft", area:"80 sq ft",
    desc:"Modular kitchen with granite countertops, stainless steel appliances, and ample cabinet storage.",
    color:"#0d0d1a",
    furniture:[
      { type:"counter", x:-3, z:3.5, w:5,  h:0.9,d:1.2, color:0x1a1a2e, label:"Counter"  },
      { type:"island",  x:0,  z:0.5, w:2,  h:0.9,d:1,   color:0xb8960c, label:"Island"   },
      { type:"fridge",  x:3,  z:3,   w:1,  h:1.8,d:0.8, color:0x2a2a2a, label:"Fridge"   },
      { type:"sink",    x:-1, z:3.8, w:0.8,h:0.95,d:0.6,color:0x888888, label:"Sink"     },
    ]
  },
  {
    id:"master", name:"Master Bedroom",
    icon:"🛏",
    size:"12 × 11 ft", area:"132 sq ft",
    desc:"Luxurious master bedroom with walk-in wardrobe, attached bathroom, and panoramic garden views.",
    color:"#0d0800",
    furniture:[
      { type:"bed",      x:0,  z:1.5, w:3.5,h:0.6,d:4,  color:0x1a0f00, label:"King Bed"  },
      { type:"wardrobe", x:-4, z:2,   w:1.2,h:2,  d:3,  color:0x2a1500, label:"Wardrobe"  },
      { type:"dresser",  x:3.5,z:2,   w:1,  h:1,  d:1.5,color:0x1a0f00, label:"Dresser"   },
      { type:"lamp",     x:2,  z:3.5, w:0.2,h:1.2,d:0.2,color:0xd4af37, label:"Bedside"   },
      { type:"lamp",     x:-2, z:3.5, w:0.2,h:1.2,d:0.2,color:0xd4af37, label:"Bedside"   },
    ]
  },
  {
    id:"bed2", name:"Bedroom 2",
    icon:"🛏",
    size:"11 × 10 ft", area:"110 sq ft",
    desc:"Cozy secondary bedroom with built-in study desk, ample wardrobe space, and natural light.",
    color:"#080d0d",
    furniture:[
      { type:"bed",      x:0,  z:1.5, w:3,  h:0.6,d:3.5,color:0x111a1a, label:"Queen Bed" },
      { type:"wardrobe", x:-3.5,z:2,  w:1,  h:1.9,d:2.5,color:0x1a1a1a, label:"Wardrobe"  },
      { type:"desk",     x:3,  z:2.5, w:1.5,h:0.8,d:1,  color:0xb8960c, label:"Study Desk"},
    ]
  },
  {
    id:"balcony", name:"Balcony",
    icon:"🌇",
    size:"8 × 5 ft", area:"40 sq ft",
    desc:"Private balcony overlooking lush gardens, swimming pool, and the city skyline beyond.",
    color:"#000a1a",
    furniture:[
      { type:"chair",  x:-1.5,z:0,   w:0.8,h:0.8,d:0.8,color:0x3a3a3a, label:"Chair"      },
      { type:"chair",  x:1.5, z:0,   w:0.8,h:0.8,d:0.8,color:0x3a3a3a, label:"Chair"      },
      { type:"table",  x:0,   z:0.5, w:1,  h:0.7,d:1,  color:0xb8960c, label:"Cafe Table"  },
      { type:"plant",  x:-3,  z:1.5, w:0.5,h:1.2,d:0.5,color:0x2d5a27, label:"Plant"      },
    ]
  },
  {
    id:"bathroom", name:"Bathroom",
    icon:"🚿",
    size:"8 × 6 ft", area:"48 sq ft",
    desc:"Premium bathroom with Jacuzzi tub, rainfall shower, anti-fog mirror, and Italian marble tiles.",
    color:"#0a0a0a",
    furniture:[
      { type:"tub",    x:-2, z:2,   w:1.5,h:0.6,d:3,  color:0x1a1a2e, label:"Jacuzzi"  },
      { type:"sink",   x:2,  z:3,   w:0.8,h:0.9,d:0.6,color:0xcccccc, label:"Sink"     },
      { type:"shower", x:2,  z:-1,  w:1.2,h:2.2,d:1.2,color:0x2a2a3e, label:"Shower"   },
      { type:"toilet", x:-2, z:-1.5,w:0.7,h:0.8,d:1,  color:0xdddddd, label:"Toilet"   },
    ]
  },
];

const ROOMS_3BHK = [
  ...ROOMS_2BHK.slice(0,4),
  {
    id:"bed3", name:"Bedroom 3",
    icon:"🛏",
    size:"11 × 10 ft", area:"110 sq ft",
    desc:"Third bedroom perfect as a guest room or home office, with large windows and neutral tones.",
    color:"#0a080d",
    furniture:[
      { type:"bed",      x:0,  z:1.5, w:3,  h:0.6,d:3.5,color:0x111118, label:"Queen Bed" },
      { type:"wardrobe", x:-3.5,z:2,  w:1,  h:1.9,d:2.5,color:0x1a1a2a, label:"Wardrobe"  },
    ]
  },
  ...ROOMS_2BHK.slice(4),
];

const ROOMS_4BHK = [
  {
    id:"living", name:"Grand Living",
    icon:"🛋",
    size:"20 × 18 ft", area:"360 sq ft",
    desc:"Expansive grand living room with double-height ceiling, Italian marble flooring, and bespoke chandeliers.",
    color:"#1a1200",
    furniture:[
      { type:"sofa",   x:-3,  z:2,  w:7, h:0.9,d:3,  color:0x2c2c2c, label:"Grand Sofa"  },
      { type:"table",  x:0,   z:-1, w:3, h:0.4,d:2,  color:0xb8960c, label:"Coffee Table" },
      { type:"tv",     x:0,   z:5,  w:5, h:2.5,d:0.2,color:0x111111, label:"100\" TV"    },
      { type:"plant",  x:4,   z:4,  w:0.8,h:2.5,d:0.8,color:0x2d5a27,label:"Tall Plant"  },
    ]
  },
  ...ROOMS_3BHK.slice(1),
  {
    id:"terrace", name:"Private Terrace",
    icon:"🏙",
    size:"20 × 12 ft", area:"240 sq ft",
    desc:"Exclusive rooftop terrace with panoramic 360° city views, outdoor lounge, and plunge pool access.",
    color:"#00050a",
    furniture:[
      { type:"sofa",  x:0,   z:-1, w:4, h:0.7,d:2,  color:0x1a1a1a, label:"Outdoor Sofa" },
      { type:"table", x:0,   z:2,  w:1.5,h:0.7,d:1, color:0xb8960c, label:"Table"       },
      { type:"plant", x:-4,  z:3,  w:0.5,h:1.5,d:0.5,color:0x2d5a27,label:"Plant"       },
      { type:"plant", x:4,   z:3,  w:0.5,h:1.5,d:0.5,color:0x2d5a27,label:"Plant"       },
    ]
  },
];

// ─── FLOORS DATA ──────────────────────────────────────────────────────────────
export const FLOORS = [
  {
    id:1, label:"Floor 1", subtitle:"Ground Level Residences",
    apartments:[
      { id:"1A", name:"Suite 1A", type:"2 BHK", area:"950 sqft", price:"₹45 L",  status:"available", rooms:ROOMS_2BHK,
        layout:[ // [col, row, w, h, label, type]
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"1B", name:"Suite 1B", type:"3 BHK", area:"1250 sqft", price:"₹62 L", status:"sold",      rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
      { id:"1C", name:"Suite 1C", type:"2 BHK", area:"950 sqft",  price:"₹45 L", status:"reserved",  rooms:ROOMS_2BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"1D", name:"Suite 1D", type:"3 BHK", area:"1250 sqft", price:"₹62 L", status:"available", rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
    ]
  },
  {
    id:2, label:"Floor 2", subtitle:"Elevated Garden View",
    apartments:[
      { id:"2A", name:"Suite 2A", type:"2 BHK", area:"950 sqft",  price:"₹47 L", status:"available", rooms:ROOMS_2BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"2B", name:"Suite 2B", type:"3 BHK", area:"1250 sqft", price:"₹65 L", status:"available", rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
      { id:"2C", name:"Suite 2C", type:"2 BHK", area:"950 sqft",  price:"₹47 L", status:"sold",      rooms:ROOMS_2BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"2D", name:"Suite 2D", type:"3 BHK", area:"1250 sqft", price:"₹65 L", status:"reserved",  rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
    ]
  },
  {
    id:3, label:"Floor 3", subtitle:"Skyline Collection",
    apartments:[
      { id:"3A", name:"Suite 3A", type:"2 BHK", area:"950 sqft",  price:"₹49 L", status:"reserved",  rooms:ROOMS_2BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"3B", name:"Suite 3B", type:"3 BHK", area:"1250 sqft", price:"₹68 L", status:"available", rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
      { id:"3C", name:"Suite 3C", type:"2 BHK", area:"950 sqft",  price:"₹49 L", status:"available", rooms:ROOMS_2BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [3,1,2,1,"Bathroom","bathroom"],  [4,2,1,2,"Balcony","balcony"],
        ]
      },
      { id:"3D", name:"Suite 3D", type:"3 BHK", area:"1250 sqft", price:"₹68 L", status:"available", rooms:ROOMS_3BHK,
        layout:[
          [0,0,3,2,"Living Room","living"], [3,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],  [2,2,2,2,"Bedroom 2","bed2"],
          [4,0,2,2,"Bedroom 3","bed3"],     [3,1,2,1,"Bathroom","bathroom"],
          [4,2,2,2,"Balcony","balcony"],
        ]
      },
    ]
  },
  {
    id:4, label:"Penthouse", subtitle:"Exclusive Crown Residences",
    apartments:[
      { id:"4A", name:"Penthouse A", type:"4 BHK", area:"2100 sqft", price:"₹1.2 Cr", status:"available", rooms:ROOMS_4BHK,
        layout:[
          [0,0,4,2,"Grand Living","living"],  [4,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],     [2,2,2,2,"Bedroom 2","bed2"],
          [4,1,2,2,"Bedroom 3","bed3"],        [3,1,1,1,"Bathroom","bathroom"],
          [4,2,2,2,"Terrace","terrace"],
        ]
      },
      { id:"4B", name:"Penthouse B", type:"4 BHK", area:"2100 sqft", price:"₹1.2 Cr", status:"sold",      rooms:ROOMS_4BHK,
        layout:[
          [0,0,4,2,"Grand Living","living"],  [4,0,2,1,"Kitchen","kitchen"],
          [0,2,2,2,"Master Bed","master"],     [2,2,2,2,"Bedroom 2","bed2"],
          [4,1,2,2,"Bedroom 3","bed3"],        [3,1,1,1,"Bathroom","bathroom"],
          [4,2,2,2,"Terrace","terrace"],
        ]
      },
    ]
  },
];
