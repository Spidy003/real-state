// ─── Shared project data used across all components ───
import projectKharghar from '../assets/project-kharghar.png'
import projectTaloja   from '../assets/project-taloja.png'
import projectPanvel   from '../assets/project-panvel.png'

export const projects = [
  {
    id: 'kharghar',
    image: projectKharghar,
    title: 'Aura Heights',
    location: 'Sector 20, Kharghar, Navi Mumbai',
    tag: 'Ultra Luxury Residences',
    completion: 'Dec 2027',
    rera: 'P52000034182',
    startingPrice: '₹75 L+',
    bhkSummary: '1, 2.5 & 3.5 BHK',
    areaSummary: '465 – 1,120 sq.ft',
    highlights: ['4 Mins from Metro', 'Infinity Rooftop Pool', 'G+28 Iconic Tower'],
    lat: 19.0435, lng: 73.0645,
    basePrices: { '1 BHK': 7500000, '2.5 BHK': 12000000, '3.5 BHK': 18000000 },
    pricing: {
      '1 BHK': { price: '₹75 L+', area: '465 sq.ft carpet' },
      '2.5 BHK': { price: '₹1.20 Cr+', area: '780 sq.ft carpet' },
      '3.5 BHK': { price: '₹1.80 Cr+', area: '1,120 sq.ft carpet' },
    },
    // ── NEW: Flat Availability & Possession ──
    inventory: {
      totalFlats: 72,
      available: 24,
      booked: 12,
      sold: 36,
      byBHK: {
        '1 BHK': { total: 24, available: 10, booked: 4, sold: 10 },
        '2.5 BHK': { total: 28, available: 8, booked: 5, sold: 15 },
        '3.5 BHK': { total: 20, available: 6, booked: 3, sold: 11 },
      },
      byFloor: [
        { floor: 'G+1 to G+7', total: 14, available: 2, booked: 3, sold: 9 },
        { floor: 'G+8 to G+14', total: 14, available: 4, booked: 2, sold: 8 },
        { floor: 'G+15 to G+21', total: 16, available: 6, booked: 3, sold: 7 },
        { floor: 'G+22 to G+28', total: 28, available: 12, booked: 4, sold: 12 },
      ],
    },
    possession: {
      expected: 'December 2027',
      confirmed: null,
      constructionProgress: 62,
    },
    bookingStatus: 'Booking Open',
    status: 'Published',
    amenities: ['Swimming Pool', 'Gymnasium', 'Children Play Area', 'Clubhouse', 'Jogging Track', 'Landscaped Garden', 'Indoor Games Room', '24/7 Security', 'Power Backup', 'Infinity Rooftop Pool', 'Multi-purpose Hall', 'EV Charging'],
    landmarks: {
      transit: [
        { name: 'Kharghar Sector 20 Metro', time: '4 mins', dist: '1.2 km', lat: 19.0450, lng: 73.0600 },
        { name: 'Central Park Metro', time: '7 mins', dist: '2.5 km', lat: 19.0600, lng: 73.0680 },
      ],
      education: [
        { name: 'Vibgyor High School', time: '5 mins', dist: '1.5 km', lat: 19.0490, lng: 73.0670 },
        { name: 'NIFT Campus', time: '9 mins', dist: '3.2 km', lat: 19.0400, lng: 73.0720 },
      ],
      healthcare: [
        { name: 'MGM Multispecialty Hospital', time: '10 mins', dist: '4.0 km', lat: 19.0250, lng: 73.0780 },
        { name: 'Tata Memorial Center', time: '12 mins', dist: '4.8 km', lat: 19.0480, lng: 73.0850 },
      ],
      lifestyle: [
        { name: 'Kharghar Golf Course', time: '6 mins', dist: '2.1 km', lat: 19.0550, lng: 73.0665 },
        { name: 'Little World Mall', time: '11 mins', dist: '3.8 km', lat: 19.0220, lng: 73.0610 },
      ],
    },
  },
  {
    id: 'taloja',
    image: projectTaloja,
    title: 'Eco Meadows',
    location: 'Phase 2, Taloja, Navi Mumbai',
    tag: 'Smart Eco Living',
    completion: 'Aug 2028',
    rera: 'P52000041290',
    startingPrice: '₹45 L+',
    bhkSummary: '1, 2 & 3 BHK',
    areaSummary: '420 – 910 sq.ft',
    highlights: ['3 Mins from Metro', '70% Open Green', 'EV Charging Bays'],
    lat: 19.0710, lng: 73.0980,
    basePrices: { '1 BHK': 4500000, '2 BHK': 7500000, '3 BHK': 11000000 },
    pricing: {
      '1 BHK': { price: '₹45 L+', area: '420 sq.ft carpet' },
      '2 BHK': { price: '₹75 L+', area: '640 sq.ft carpet' },
      '3 BHK': { price: '₹1.10 Cr+', area: '910 sq.ft carpet' },
    },
    inventory: {
      totalFlats: 108,
      available: 42,
      booked: 18,
      sold: 48,
      byBHK: {
        '1 BHK': { total: 36, available: 16, booked: 6, sold: 14 },
        '2 BHK': { total: 42, available: 15, booked: 7, sold: 20 },
        '3 BHK': { total: 30, available: 11, booked: 5, sold: 14 },
      },
      byFloor: [
        { floor: 'G+1 to G+5', total: 20, available: 4, booked: 4, sold: 12 },
        { floor: 'G+6 to G+10', total: 20, available: 6, booked: 3, sold: 11 },
        { floor: 'G+11 to G+15', total: 24, available: 10, booked: 4, sold: 10 },
        { floor: 'G+16 to G+20', total: 24, available: 12, booked: 4, sold: 8 },
        { floor: 'G+21 to G+24', total: 20, available: 10, booked: 3, sold: 7 },
      ],
    },
    possession: {
      expected: 'August 2028',
      confirmed: null,
      constructionProgress: 38,
    },
    bookingStatus: 'Booking Open',
    status: 'Published',
    amenities: ['Swimming Pool', 'Gymnasium', 'Children Play Area', 'Clubhouse', 'Jogging Track', '70% Open Landscaped Green', 'EV Charging Bays', '24/7 Security', 'Power Backup', 'Yoga Deck', 'Senior Citizen Zone'],
    landmarks: {
      transit: [
        { name: 'Taloja Phase 2 Metro', time: '3 mins', dist: '0.8 km', lat: 19.0760, lng: 73.1000 },
        { name: 'Pendhar Metro Station', time: '8 mins', dist: '2.9 km', lat: 19.0820, lng: 73.0920 },
      ],
      education: [
        { name: 'The Elite Public School', time: '6 mins', dist: '1.8 km', lat: 19.0650, lng: 73.1050 },
        { name: 'Taloja Central High', time: '8 mins', dist: '2.6 km', lat: 19.0600, lng: 73.0900 },
      ],
      healthcare: [
        { name: 'Apex General Hospital', time: '7 mins', dist: '2.2 km', lat: 19.0740, lng: 73.1030 },
        { name: 'Mata Child Care Hospital', time: '10 mins', dist: '3.1 km', lat: 19.0680, lng: 73.0880 },
      ],
      lifestyle: [
        { name: 'Taloja Eco Central Park', time: '5 mins', dist: '1.4 km', lat: 19.0750, lng: 73.1080 },
        { name: 'Eco Meadows Galleria', time: '2 mins', dist: '0.4 km', lat: 19.0700, lng: 73.0950 },
      ],
    },
  },
  {
    id: 'panvel',
    image: projectPanvel,
    title: 'Skyline Oasis',
    location: 'Panvel East, Navi Mumbai',
    tag: 'Signature Landmark',
    completion: 'Mar 2029',
    rera: 'P52000048911',
    startingPrice: '₹60 L+',
    bhkSummary: '1, 2 & 3 BHK',
    areaSummary: '445 – 1,010 sq.ft',
    highlights: ['10 Mins to NMIA Airport', 'Grand 25k sq.ft Clubhouse', 'Podium Sports Park'],
    lat: 18.9950, lng: 73.1250,
    basePrices: { '1 BHK': 6000000, '2 BHK': 9500000, '3 BHK': 14000000 },
    pricing: {
      '1 BHK': { price: '₹60 L+', area: '445 sq.ft carpet' },
      '2 BHK': { price: '₹95 L+', area: '690 sq.ft carpet' },
      '3 BHK': { price: '₹1.40 Cr+', area: '1,010 sq.ft carpet' },
    },
    inventory: {
      totalFlats: 96,
      available: 38,
      booked: 15,
      sold: 43,
      byBHK: {
        '1 BHK': { total: 32, available: 14, booked: 5, sold: 13 },
        '2 BHK': { total: 36, available: 13, booked: 6, sold: 17 },
        '3 BHK': { total: 28, available: 11, booked: 4, sold: 13 },
      },
      byFloor: [
        { floor: 'G+1 to G+5', total: 20, available: 4, booked: 3, sold: 13 },
        { floor: 'G+6 to G+10', total: 20, available: 6, booked: 4, sold: 10 },
        { floor: 'G+11 to G+15', total: 20, available: 8, booked: 3, sold: 9 },
        { floor: 'G+16 to G+20', total: 20, available: 10, booked: 3, sold: 7 },
        { floor: 'G+21 to G+24', total: 16, available: 10, booked: 2, sold: 4 },
      ],
    },
    possession: {
      expected: 'March 2029',
      confirmed: null,
      constructionProgress: 22,
    },
    bookingStatus: 'Booking Open',
    status: 'Published',
    amenities: ['Swimming Pool', 'Grand 25k sq.ft Clubhouse', 'Gymnasium', 'Children Play Area', 'Podium Sports Park', 'Jogging Track', 'Landscaped Garden', '24/7 Security', 'Power Backup', 'Amphitheatre', 'Co-working Space'],
    landmarks: {
      transit: [
        { name: 'Panvel Railway Station', time: '6 mins', dist: '2.2 km', lat: 18.9890, lng: 73.1160 },
        { name: 'Navi Mumbai Airport Transit', time: '10 mins', dist: '4.5 km', lat: 19.0200, lng: 73.0800 },
      ],
      education: [
        { name: 'Amity International University', time: '12 mins', dist: '5.0 km', lat: 18.9750, lng: 73.1600 },
        { name: 'DAV Public School', time: '8 mins', dist: '3.0 km', lat: 18.9980, lng: 73.1120 },
      ],
      healthcare: [
        { name: 'Apollo Hospital Panvel', time: '9 mins', dist: '3.5 km', lat: 19.0150, lng: 73.1180 },
        { name: 'Lifeline Multispecialty', time: '6 mins', dist: '2.1 km', lat: 18.9920, lng: 73.1200 },
      ],
      lifestyle: [
        { name: 'Orion Mall Multiplex', time: '7 mins', dist: '2.4 km', lat: 18.9930, lng: 73.1170 },
        { name: 'Karnala Eco Sanctuary', time: '20 mins', dist: '9.5 km', lat: 18.8950, lng: 73.1150 },
      ],
    },
  },
]
