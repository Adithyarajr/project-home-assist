import tarunPhoto from './assets/tarun.jpg'
import niladriPhoto from './assets/niladri.jpg'
import naeemPhoto from './assets/naeem.jpg'
import umairPhoto from './assets/umair.jpg'
import nirpeshPhoto from './assets/nirpesh.jpg'
import thamarPhoto from './assets/thamar.jpg'

export const helpers = [
  {
    id: 1,
    name: "Tarun Yadav",
    role: "Cook",
    experience: "5 years",
    location: "Kothnur, Bengaluru",
    verified: true,
    phone: "+91 6361416557",
    photo: tarunPhoto,
    rating: 4.0,
    reviews: [
    { author: "Padma", comment: "This nga is NOT punctual, but a decent cook.", rating: 3 },
    { author: "Dharmendra Pradhan", comment: "Reliable and clean. Would recommend.", rating: 5 },
  ],
  },
  {
    id: 2,
    name: "Niladri Lahiri",
    role: "Housekeeper",
    experience: "3 years",
    location: "Kalyan Nagar, Bengaluru",
    verified: true,
    phone: "+91 7019349162",
    photo: niladriPhoto,
    rating: 2.0,
    reviews: [
    { author: "Rohith", comment: "No idea what housekeeping he does,as I am homeless.Regardless, he's chill like that.", rating: 2 },
    { author: "Preetam", comment: "Good housekeeper and all, but hes always on something, quite entertaining.", rating: 2 },
  ],
  },
  {
    id: 3,
    name: "Muhammad Naeem",
    role: "Babysitter",
    experience: "8 years",
    location: "Kammanahalli, Bengaluru",
    verified: true,
    phone: "+91 8925723421",
    photo: naeemPhoto,
    rating: 5.0,
    reviews: [
    { author: "Zaynah", comment: "Sorry to come in bw both of you...", rating: 5 },
    { author: "Uzair Baloch", comment: "Very Reliable.Keeps my kids away from Hamza.", rating: 5 },
  ],
  },
  {
    id: 4,
    name: "Umair Faiz",
    role: "Dishwasher",
    experience: "6 years",
    location: "Kammanahalli, Bengaluru",
    verified: true,
    phone: "+91 7892232942",
    photo: umairPhoto,
    rating: 3.0,
    reviews: [
    { author: "Tarun Yadav", comment: "This nga disagrees with everything I say, but can WASH them dishes.", rating: 3 },
    { author: "Lakshmi Ammal", comment: "Biggest football larper ive ever seen, switches up on the team he supports, but still a good dishwasher.", rating: 3 },
  ],
  },
  {
    id: 5,
    name: "Nirpesh Chandrashekan",
    role: "Gardener",
    experience: "4 years",
    location: "Horamavu Agara, Bengaluru",
    verified: false,
    phone: "+91 8618354430",
    photo: nirpeshPhoto,
    rating: 4.0,
    reviews: [
    { author: "Glory Satish", comment: "He is good with his hands...", rating: 4 },
    { author: "Thalapathy Vijay", comment: "Very knowledgeable about plants.", rating: 4 },
  ],
  },
  {
    id: 6,
    name: "Thamar Preetam Mopidevi",
    role: "Nanny for Elderly",
    experience: "10 years",
    location: "Kasturi Nagar, Bengaluru",
    verified: false,
    phone: "+91 9019661210",
    photo: thamarPhoto,
    rating: 2.5,
    reviews: [
    { author: "Kinjal", comment: "Very caring and attentive.", rating: 3 },
    { author: "Auto Driver", comment: "He takes care of my grandparents, while i complete my rides.", rating: 2 },
  ],
  }
]