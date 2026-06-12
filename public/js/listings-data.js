// =============================================
// ENERMIND — LISTINGS DATA
// =============================================

const LISTINGS = [
  {
    id: 1, cat: 'birds', category: 'Live Birds',
    title: 'Broiler chicks — day-old, vaccinated',
    county: 'Kiambu', region: 'Central',
    price: 'KES 85', unit: '/ chick',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['Min. 50 chicks', 'Cobb 500', 'Vaccinated'],
    unlockFee: 50,
    seller: { name: 'John Mwangi', farm: 'Sunrise Poultry Farm', phone: '+254712345678', whatsapp: '+254712345678', location: 'Off Kiambu Road, near Ruaka' }
  },
  {
    id: 2, cat: 'birds', category: 'Live Birds',
    title: 'Layers — 18 weeks, ready to lay',
    county: 'Nakuru', region: 'Rift Valley',
    price: 'KES 950', unit: '/ bird',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['500 birds', 'Isa Brown', 'Vaccinated'],
    unlockFee: 50,
    seller: { name: 'Grace Njeri', farm: 'Njeri Layer Farm', phone: '+254723456789', whatsapp: '+254723456789', location: 'Nakuru Town, near Lake Hotel' }
  },
  {
    id: 3, cat: 'birds', category: 'Live Birds',
    title: 'Spent layers — bulk clearance',
    county: 'Eldoret', region: 'Uasin Gishu',
    price: 'KES 300', unit: '/ bird',
    badge: 'Bulk only', badgeClass: 'badge-bulk',
    pills: ['2,000 birds', 'Ready now', 'Self-collect'],
    unlockFee: 50,
    seller: { name: 'Peter Rotich', farm: 'Uasin Farm Ltd', phone: '+254734567890', whatsapp: '+254734567890', location: 'Eldoret, off Uganda Rd' }
  },
  {
    id: 4, cat: 'birds', category: 'Live Birds',
    title: 'Kari improved kienyeji — 8 weeks',
    county: "Murang'a", region: 'Central',
    price: 'KES 650', unit: '/ bird',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['150 birds', 'Free-range', 'Organic'],
    unlockFee: 50,
    seller: { name: 'Mary Wanjiku', farm: 'Wanjiku Heritage Farm', phone: '+254745678901', whatsapp: '+254745678901', location: "Kangema, Murang'a County" }
  },
  {
    id: 5, cat: 'eggs', category: 'Eggs',
    title: 'Large grade eggs — consistent supply',
    county: 'Kiambu', region: 'Central',
    price: 'KES 680', unit: '/ tray (30)',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['500+ trays/wk', 'Grade A', 'Weekly supply'],
    unlockFee: 50,
    seller: { name: 'Samuel Karanja', farm: 'Karanja Eggs', phone: '+254756789012', whatsapp: '+254756789012', location: 'Thika Road, Ruiru' }
  },
  {
    id: 6, cat: 'eggs', category: 'Eggs',
    title: 'Kienyeji eggs — free range organic',
    county: 'Nyeri', region: 'Mt Kenya',
    price: 'KES 850', unit: '/ tray (30)',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['Free-range', 'Organic', 'Min. 10 trays'],
    unlockFee: 50,
    seller: { name: 'Agnes Wambui', farm: 'Thaara Organic Farm', phone: '+254767890123', whatsapp: '+254767890123', location: 'Othaya, Nyeri County' }
  },
  {
    id: 7, cat: 'feeds', category: 'Feeds',
    title: 'Broiler starter crumbs — 23% protein',
    county: 'Nairobi', region: 'Nairobi',
    price: 'KES 2,950', unit: '/ 50kg bag',
    badge: 'In stock', badgeClass: 'badge-available',
    pills: ['23% protein', 'Delivery available', 'Min. 5 bags'],
    unlockFee: 75,
    seller: { name: 'Premier Feeds Ltd', farm: 'Premier Feeds Ltd', phone: '+254778901234', whatsapp: '+254778901234', location: 'Industrial Area, Nairobi' }
  },
  {
    id: 8, cat: 'feeds', category: 'Feeds',
    title: 'Layer mash 18% — high performance',
    county: 'Nairobi', region: 'Nairobi',
    price: 'KES 2,750', unit: '/ 50kg bag',
    badge: 'In stock', badgeClass: 'badge-available',
    pills: ['18% protein', 'Min. 10 bags', 'Bulk discount'],
    unlockFee: 75,
    seller: { name: 'Agri Feeds Kenya', farm: 'Agri Feeds Kenya', phone: '+254789012345', whatsapp: '+254789012345', location: 'Mombasa Road, Nairobi' }
  },
  {
    id: 9, cat: 'vets', category: 'Vet Products',
    title: 'Newcastle vaccine (La Sota) — 1000 dose',
    county: 'Nairobi', region: 'Nairobi',
    price: 'KES 1,200', unit: '/ vial',
    badge: 'In stock', badgeClass: 'badge-available',
    pills: ['Cold chain', 'Import quality', 'Bulk discount'],
    unlockFee: 75,
    seller: { name: 'Westlands Agrovet', farm: 'Westlands Agrovet', phone: '+254790123456', whatsapp: '+254790123456', location: 'Westlands, Nairobi' }
  },
  {
    id: 10, cat: 'birds', category: 'Live Birds',
    title: 'Rainbow rooster cockerels — 12 weeks',
    county: 'Meru', region: 'Mt Kenya',
    price: 'KES 750', unit: '/ bird',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['80 birds', 'Dual purpose', 'Vaccinated'],
    unlockFee: 50,
    seller: { name: 'James Kirimi', farm: 'Kirimi Poultry', phone: '+254711223344', whatsapp: '+254711223344', location: 'Meru Town, off Njuri Ncheke St' }
  },
  {
    id: 11, cat: 'eggs', category: 'Eggs',
    title: 'Fertilised eggs — Cobb 500 broiler',
    county: 'Thika', region: 'Central',
    price: 'KES 35', unit: '/ egg',
    badge: 'Available', badgeClass: 'badge-available',
    pills: ['Min. 200 eggs', 'Cobb 500', 'Hatchery quality'],
    unlockFee: 50,
    seller: { name: 'Thika Hatchery', farm: 'Thika Hatchery Ltd', phone: '+254722334455', whatsapp: '+254722334455', location: 'Thika, off Garissa Rd' }
  },
  {
    id: 12, cat: 'vets', category: 'Vet Products',
    title: 'Gumboro (IBD) vaccine — 1000 dose',
    county: 'Nakuru', region: 'Rift Valley',
    price: 'KES 950', unit: '/ vial',
    badge: 'In stock', badgeClass: 'badge-available',
    pills: ['Cold chain', 'Batch tested', 'Fast delivery'],
    unlockFee: 75,
    seller: { name: 'Agrivet Nakuru', farm: 'Agrivet Nakuru', phone: '+254733445566', whatsapp: '+254733445566', location: 'Nakuru Town, Kenyatta Ave' }
  },
];

const DIRECTORY = [
  { id: 1, role: 'Farmer', name: 'John Mwangi', initials: 'JM', avatarColor: '#e8f5e0', avatarText: '#27500A', sub: 'Broiler farmer · Kiambu County', rating: '4.9', reviews: 42, tags: ['Broilers', 'Day-old chicks', 'KES 85/chick'] },
  { id: 2, role: 'Agrovet', name: 'Agrivet Nakuru', initials: 'AN', avatarColor: '#e6f1fb', avatarText: '#0C447C', sub: 'Agrovet · Nakuru County', rating: '4.6', reviews: 89, tags: ['Vaccines', 'Antibiotics', 'Consultations'] },
  { id: 3, role: 'Feed Seller', name: 'Premier Feeds Ltd', initials: 'PF', avatarColor: '#faeeda', avatarText: '#633806', sub: 'Feed seller · Nairobi', rating: '4.8', reviews: 130, tags: ['Starter', 'Grower', 'Finisher'] },
  { id: 4, role: 'Farmer', name: 'Grace Wambui', initials: 'GW', avatarColor: '#f5e8f0', avatarText: '#72243E', sub: 'Layer farmer · Murang\'a County', rating: '4.7', reviews: 58, tags: ['Layers', 'Eggs', 'Kienyeji'] },
  { id: 5, role: 'Buyer', name: 'Nairobi Meats Ltd', initials: 'NM', avatarColor: '#e8f5e0', avatarText: '#27500A', sub: 'Off-taker · Nairobi', rating: '4.5', reviews: 34, tags: ['Broilers', 'Bulk buying', 'Weekly orders'] },
  { id: 6, role: 'Agrovet', name: 'Eldoret Agrovet', initials: 'EA', avatarColor: '#e6f1fb', avatarText: '#0C447C', sub: 'Agrovet · Uasin Gishu', rating: '4.4', reviews: 67, tags: ['Dewormer', 'Vitamins', 'Supplements'] },
  { id: 7, role: 'Farmer', name: 'Peter Rotich', initials: 'PR', avatarColor: '#e8f5e0', avatarText: '#27500A', sub: 'Layer & broiler farmer · Eldoret', rating: '4.6', reviews: 21, tags: ['Spent layers', 'Bulk', 'Self-collect'] },
  { id: 8, role: 'Feed Seller', name: 'Agri Feeds Kenya', initials: 'AF', avatarColor: '#faeeda', avatarText: '#633806', sub: 'Feed seller · Nairobi', rating: '4.7', reviews: 95, tags: ['Layer mash', 'Broiler feed', 'Bulk discount'] },
  { id: 9, role: 'Buyer', name: 'Mombasa Processors', initials: 'MP', avatarColor: '#f5ede2', avatarText: '#6b3a1f', sub: 'Off-taker · Mombasa County', rating: '4.3', reviews: 18, tags: ['Broilers', 'Coast region', 'Weekly'] },
];

const PLANS = [
  { id: 'basic', name: 'Basic', price: 200, duration: '30 days', features: ['1 listing', 'Basic visibility', 'Phone contact visible'] },
  { id: 'standard', name: 'Standard', price: 350, duration: '60 days', popular: true, features: ['3 listings', 'Higher ranking', 'Phone + WhatsApp', 'Verified badge'] },
  { id: 'premium', name: 'Premium', price: 500, duration: '90 days', features: ['Unlimited listings', 'Top placement', 'All contact details', 'Priority support'] },
];
