export const DEFAULT_QURAN_HADITH = [
  // === QURAN VERSES ===
  {
    type: "QURAN" as const,
    textArabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    textTranslation:
      "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus makhluk-Nya. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi.",
    reference: "Surah Al-Baqarah 2:255 (Ayatul Kursi)",
    sortOrder: 0,
  },
  {
    type: "QURAN" as const,
    textArabic:
      "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
    textTranslation:
      "Sesungguhnya Allah dan para malaikat-Nya bershalawat untuk Nabi. Wahai orang-orang yang beriman, bershalawatlah kamu untuk Nabi dan ucapkanlah salam dengan penuh penghormatan kepadanya.",
    reference: "Surah Al-Ahzab 33:56",
    sortOrder: 1,
  },
  {
    type: "QURAN" as const,
    textArabic:
      "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    textTranslation:
      "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku.",
    reference: "Surah Al-Baqarah 2:186",
    sortOrder: 2,
  },
  {
    type: "QURAN" as const,
    textArabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    textTranslation:
      "Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu. Bersyukurlah kepada-Ku dan janganlah kamu ingkar kepada-Ku.",
    reference: "Surah Al-Baqarah 2:152",
    sortOrder: 3,
  },
  {
    type: "QURAN" as const,
    textArabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    textTranslation: "Sesungguhnya beserta kesulitan ada kemudahan.",
    reference: "Surah Ash-Sharh 94:6",
    sortOrder: 4,
  },
  {
    type: "QURAN" as const,
    textArabic:
      "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    textTranslation:
      "Dan barang siapa bertakwa kepada Allah, niscaya Dia akan membukakan jalan keluar baginya. Dan Dia memberinya rezeki dari arah yang tidak disangka-sangkanya.",
    reference: "Surah At-Talaq 65:2-3",
    sortOrder: 5,
  },
  {
    type: "QURAN" as const,
    textArabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    textTranslation:
      "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
    reference: "Surah Al-Baqarah 2:201",
    sortOrder: 6,
  },
  {
    type: "QURAN" as const,
    textArabic:
      "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    textTranslation:
      "Dan janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya yang berputus asa dari rahmat Allah hanyalah orang-orang yang kafir.",
    reference: "Surah Yusuf 12:87",
    sortOrder: 7,
  },
  {
    type: "QURAN" as const,
    textArabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    textTranslation:
      "Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas.",
    reference: "Surah Ad-Duha 93:5",
    sortOrder: 8,
  },
  {
    type: "QURAN" as const,
    textArabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    textTranslation:
      "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    reference: "Surah Ar-Ra'd 13:28",
    sortOrder: 9,
  },
  // === HADITH ===
  {
    type: "HADITH" as const,
    textArabic:
      "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    textTranslation:
      "Sesungguhnya setiap amal perbuatan tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang diniatkannya.",
    reference: "Sahih al-Bukhari 1, Sahih Muslim 1907",
    sortOrder: 10,
  },
  {
    type: "HADITH" as const,
    textArabic:
      "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    textTranslation:
      "Tidaklah sempurna iman seseorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.",
    reference: "Sahih al-Bukhari 13, Sahih Muslim 45",
    sortOrder: 11,
  },
  {
    type: "HADITH" as const,
    textArabic:
      "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    textTranslation:
      "Barang siapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.",
    reference: "Sahih al-Bukhari 6018, Sahih Muslim 47",
    sortOrder: 12,
  },
  {
    type: "HADITH" as const,
    textArabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    textTranslation: "Senyummu di hadapan saudaramu adalah sedekah.",
    reference: "Jami at-Tirmidhi 1956",
    sortOrder: 13,
  },
  {
    type: "HADITH" as const,
    textArabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    textTranslation:
      "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya.",
    reference: "Sahih al-Bukhari 5027",
    sortOrder: 14,
  },
  {
    type: "HADITH" as const,
    textArabic:
      "الدُّنْيَا مَلْعُونَةٌ مَلْعُونٌ مَا فِيهَا إِلَّا ذِكْرَ اللَّهِ وَمَا وَالَاهُ وَعَالِمًا أَوْ مُتَعَلِّمًا",
    textTranslation:
      "Dunia itu terlaknat dan terlaknat pula apa yang ada di dalamnya, kecuali dzikir kepada Allah dan apa yang berkaitan dengannya, serta seorang alim atau penuntut ilmu.",
    reference: "Sunan Ibn Majah 4112",
    sortOrder: 15,
  },
  {
    type: "HADITH" as const,
    textArabic:
      "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    textTranslation:
      "Orang-orang yang penyayang akan disayangi oleh Allah Yang Maha Penyayang. Sayangilah yang ada di bumi, niscaya yang ada di langit akan menyayangimu.",
    reference: "Jami at-Tirmidhi 1924, Sunan Abi Dawud 4941",
    sortOrder: 16,
  },
  {
    type: "HADITH" as const,
    textArabic:
      "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    textTranslation:
      "Muslim sejati adalah orang yang kaum muslimin lainnya selamat dari gangguan lisan dan tangannya.",
    reference: "Sahih al-Bukhari 10, Sahih Muslim 40",
    sortOrder: 17,
  },
];

/**
 * Helper function to seed default Quran and Hadith for a new mosque
 * Can be used in seed scripts or when creating new mosques
 */
export function getDefaultQuranHadithForMosque(mosqueId: string) {
  return DEFAULT_QURAN_HADITH.map((item) => ({
    mosqueId,
    type: item.type,
    textArabic: item.textArabic,
    textTranslation: item.textTranslation,
    reference: item.reference,
    isActive: true,
    sortOrder: item.sortOrder,
  }));
}
