export interface BDAdministrativeData {
  divisions: {
    name: string;
    districts: {
      name: string;
      thanas: string[];
    }[];
  }[];
}

export const BD_LOCATIONS: BDAdministrativeData = {
  divisions: [
    {
      name: "Dhaka",
      districts: [
        {
          name: "Dhaka",
          thanas: [
            "Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur",
            "Badda", "Motijheel", "Khilgaon", "Rampura", "Tejgaon", "Paltan",
            "Old Dhaka", "Savar", "Dhamrai", "Keraniganj", "Jatrabari", "Demra",
            "Kafrul", "Khilkhet", "Lalbagh", "New Market", "Shahbagh", "Hazaribagh",
            "Cantonment", "Airport", "Turag", "Kamrangirchar", "Chawkbazar", "Gendaria",
            "Wari", "Sutrapur", "Shyampur", "Kadamtali", "Kalabagan", "Sher-e-Bangla Nagar",
            "Adabor", "Darussalam", "Rupnagar", "Dakshinkhan", "Uttarkhan", "Bhatara", "Vatara"
          ],
        },
        {
          name: "Gazipur",
          thanas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"],
        },
        {
          name: "Narayanganj",
          thanas: ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon", "Fatullah", "Siddhirganj"],
        },
        {
          name: "Tangail",
          thanas: ["Tangail Sadar", "Mirzapur", "Delduar", "Madhupur", "Gopalpur", "Ghatail", "Kalihati", "Nagarpur", "Sakhipur", "Basail", "Bhuapur", "Dhanbari"],
        },
        {
          name: "Faridpur",
          thanas: ["Faridpur Sadar", "Boalmari", "Bhanga", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha", "Charbhadrasan", "Alfadanga"],
        },
        {
          name: "Manikganj",
          thanas: ["Manikganj Sadar", "Singair", "Saturia", "Shibalaya", "Ghior", "Harirampur", "Daulatpur"],
        },
        {
          name: "Munshiganj",
          thanas: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Louhajang", "Tongibari", "Gazaria"],
        },
        {
          name: "Narsingdi",
          thanas: ["Narsingdi Sadar", "Palash", "Belabo", "Monohardi", "Raipura", "Shibpur"],
        },
        {
          name: "Kishoreganj",
          thanas: ["Kishoreganj Sadar", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
        },
        {
          name: "Gopalganj",
          thanas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
        },
        {
          name: "Madaripur",
          thanas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"],
        },
        {
          name: "Rajbari",
          thanas: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
        },
        {
          name: "Shariatpur",
          thanas: ["Shariatpur Sadar", "Damudya", "Naria", "Janjira", "Bhedarganj", "Gosairhat"],
        },
      ],
    },
    {
      name: "Chittagong",
      districts: [
        {
          name: "Chittagong",
          thanas: [
            "Panchlaish", "Kotwali", "Khulshi", "Pahartali", "Bakalia", "Halishahar",
            "Agrabad", "Double Mooring", "Bayazid", "Patenga", "Chandgaon", "Karnafuli",
            "Hathazari", "Raozan", "Rangunia", "Patiya", "Boalkhali", "Anwara",
            "Chandanaish", "Satkania", "Lohagara", "Banshkhali", "Sitakunda", "Mirsharai", "Fatikchhari", "Sandwip"
          ],
        },
        {
          name: "Cox's Bazar",
          thanas: ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ukhia", "Ramu", "Maheshkhali", "Kutubdia", "Pekua", "Eidgaon"],
        },
        {
          name: "Cumilla",
          thanas: [
            "Cumilla Adarsha Sadar", "Cumilla Sadar Dakshin", "Barura", "Brahmanpara", "Burichang",
            "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam",
            "Muradnagar", "Nangalkot", "Meghna", "Titas", "Monohargonj", "Lalmai"
          ],
        },
        {
          name: "Noakhali",
          thanas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"],
        },
        {
          name: "Feni",
          thanas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fulgazi", "Sonagazi"],
        },
        {
          name: "Brahmanbaria",
          thanas: ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Akhaura", "Bijoynagar"],
        },
        {
          name: "Chandpur",
          thanas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
        },
        {
          name: "Lakshmipur",
          thanas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
        },
        {
          name: "Rangamati",
          thanas: ["Rangamati Sadar", "Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"],
        },
        {
          name: "Bandarban",
          thanas: ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
        },
        {
          name: "Khagrachhari",
          thanas: ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Guimara"],
        },
      ],
    },
    {
      name: "Sylhet",
      districts: [
        {
          name: "Sylhet",
          thanas: ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Companiganj", "Zakiganj", "Osmani Nagar"],
        },
        {
          name: "Moulvibazar",
          thanas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
        },
        {
          name: "Habiganj",
          thanas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"],
        },
        {
          name: "Sunamganj",
          thanas: ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Shantiganj", "Tahirpur", "Madhyanagar"],
        },
      ],
    },
    {
      name: "Rajshahi",
      districts: [
        {
          name: "Rajshahi",
          thanas: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Durgapur", "Bagmara", "Charghat", "Puthia", "Tanore", "Godagari", "Bagha", "Mohanpur"],
        },
        {
          name: "Bogura",
          thanas: ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatola"],
        },
        {
          name: "Pabna",
          thanas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
        },
        {
          name: "Sirajganj",
          thanas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Rayganj", "Shahjadpur", "Tarash", "Ullapara"],
        },
        {
          name: "Naogaon",
          thanas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadevpurt", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
        },
        {
          name: "Natore",
          thanas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"],
        },
        {
          name: "Chapai Nawabganj",
          thanas: ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
        },
        {
          name: "Joypurhat",
          thanas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
        },
      ],
    },
    {
      name: "Khulna",
      districts: [
        {
          name: "Khulna",
          thanas: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Dumuria", "Batiaghata", "Dacope", "Paikgachha", "Koyra", "Rupsha", "Terokhada", "Dighalia"],
        },
        {
          name: "Jashore",
          thanas: ["Jashore Sadar", "Jhikargachha", "Manirampur", "Abhaynagar", "Bagherpara", "Chaugachha", "Keshabpur", "Sharsha"],
        },
        {
          name: "Kushtia",
          thanas: ["Kushtia Sadar", "Kumarkhali", "Mirpur", "Bheramara", "Daulatpur", "Khoksa"],
        },
        {
          name: "Satkhira",
          thanas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
        },
        {
          name: "Bagerhat",
          thanas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
        },
        {
          name: "Jhenaidah",
          thanas: ["Jhenaidah Sadar", "Harinakundu", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
        },
        {
          name: "Chuadanga",
          thanas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
        },
        {
          name: "Meherpur",
          thanas: ["Meherpur Sadar", "Gangni", "Mujibnagar"],
        },
        {
          name: "Magura",
          thanas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
        },
        {
          name: "Narail",
          thanas: ["Narail Sadar", "Kalia", "Lohagara"],
        },
      ],
    },
    {
      name: "Barishal",
      districts: [
        {
          name: "Barishal",
          thanas: ["Barishal Sadar", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur", "Agailjhara"],
        },
        {
          name: "Patuakhali",
          thanas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Dumki", "Rangabali"],
        },
        {
          name: "Bhola",
          thanas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
        },
        {
          name: "Pirojpur",
          thanas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkati)", "Indurkani"],
        },
        {
          name: "Barguna",
          thanas: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"],
        },
        {
          name: "Jhalokathi",
          thanas: ["Jhalokathi Sadar", "Kathalia", "Nalchhiti", "Rajapur"],
        },
      ],
    },
    {
      name: "Rangpur",
      districts: [
        {
          name: "Rangpur",
          thanas: ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
        },
        {
          name: "Dinajpur",
          thanas: ["Dinajpur Sadar", "Birganj", "Birampur", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
        },
        {
          name: "Gaibandha",
          thanas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
        },
        {
          name: "Kurigram",
          thanas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Nageshwari", "Rajarhat", "Raomari", "Ulipur", "Phulbari"],
        },
        {
          name: "Nilphamari",
          thanas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Syedpur"],
        },
        {
          name: "Thakurgaon",
          thanas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
        },
        {
          name: "Lalmonirhat",
          thanas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
        },
        {
          name: "Panchagarh",
          thanas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
        },
      ],
    },
    {
      name: "Mymensingh",
      districts: [
        {
          name: "Mymensingh",
          thanas: ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gafargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Tara Khanda"],
        },
        {
          name: "Jamalpur",
          thanas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
        },
        {
          name: "Netrokona",
          thanas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"],
        },
        {
          name: "Sherpur",
          thanas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"],
        },
      ],
    },
  ],
};
