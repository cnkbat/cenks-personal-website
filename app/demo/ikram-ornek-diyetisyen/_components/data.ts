/* Content for the Dyt. İkram Örnek site. Pure data module (no client code) so
 * both the server page (JSON-LD) and the client site can share it.
 * All copy is Turkish, realistic, and free of medical guarantees. */

export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "#hakkimda", label: "Hakkımda" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#surec", label: "Programlar" },
  { href: "#tarifler", label: "Tarifler" },
  { href: "#blog", label: "Blog" },
  { href: "#iletisim", label: "İletişim" },
];

export const HERO_BULLETS = [
  "Bahçelievler’de yüz yüze görüşme",
  "Türkiye geneli online danışmanlık",
  "Kişiye özel sürdürülebilir program",
];

export type Stat = { value?: number; prefix?: string; suffix?: string; text?: string; label: string };

export const STATS: Stat[] = [
  { value: 1200, suffix: "+", label: "Mutlu Danışan" },
  { value: 4, suffix: "+", label: "Yıl Deneyim" },
  { text: "Bilimsel", label: "Kanıta Dayalı Yaklaşım" },
  { prefix: "%", value: 98, label: "Danışan Memnuniyeti" },
];

export const ABOUT_CREDENTIALS = [
  "Beslenme ve Diyetetik",
  "Kişiye Özel Beslenme ve Diyet Danışmanlığı",
  "Sporcu Beslenmesi",
  "PCOS ve İnsülin Direnci Beslenmesi",
  "Gebelik ve Emzirme Dönemi Beslenmesi",
];

export type Result = { time: string; result: string; note: string };

export const RESULTS: Result[] = [
  { time: "3 Ay", result: "-12 kg", note: "Yağ kaybı" },
  { time: "2,5 Ay", result: "-9 kg", note: "Bel çevresi azalması" },
  { time: "4 Ay", result: "-15 kg", note: "Sürdürülebilir değişim" },
  { time: "2 Ay", result: "-8 kg", note: "Sağlıklı alışkanlık" },
  { time: "3 Ay", result: "-11 kg", note: "Enerji artışı" },
];

export type Service = { icon: string; title: string; text: string };

export const SERVICES: Service[] = [
  {
    icon: "laptop",
    title: "Online Danışmanlık",
    text: "Türkiye’nin her yerinden online görüşme ile kişiye özel beslenme programı.",
  },
  {
    icon: "handshake",
    title: "Yüz Yüze Danışmanlık",
    text: "Bahçelievler’de birebir görüşme ile detaylı takip ve beslenme planı.",
  },
  {
    icon: "flower",
    title: "PCOS Beslenmesi",
    text: "Polikistik over sendromuna uygun, sürdürülebilir beslenme desteği.",
  },
  {
    icon: "baby",
    title: "Gebelik Beslenmesi",
    text: "Gebelik ve emzirme döneminde ihtiyaçlarınıza uygun sağlıklı beslenme rehberliği.",
  },
  {
    icon: "dumbbell",
    title: "Sporcu Beslenmesi",
    text: "Performans, kas gelişimi ve toparlanma hedeflerine uygun beslenme planları.",
  },
  {
    icon: "building",
    title: "Kurumsal Danışmanlık",
    text: "Şirketlere özel beslenme eğitimleri, seminerler ve sağlıklı yaşam programları.",
  },
];

export type Step = { title: string; text: string };

export const PROCESS: Step[] = [
  { title: "Ön Görüşme", text: "Hedeflerinizi ve ihtiyaçlarınızı konuşuyoruz." },
  {
    title: "Analiz",
    text: "Yaşam tarzınızı, beslenme düzeninizi ve beklentilerinizi değerlendiriyoruz.",
  },
  {
    title: "Kişiye Özel Program",
    text: "Size özel, uygulanabilir beslenme planınızı oluşturuyoruz.",
  },
  {
    title: "Haftalık Takip",
    text: "Düzenli takip ve destekle süreci birlikte yönetiyoruz.",
  },
  {
    title: "Kalıcı Sonuçlar",
    text: "Sürdürülebilir alışkanlıklarla hedeflerinize ilerliyoruz.",
  },
];

export type Recipe = {
  img: string;
  alt: string;
  title: string;
  time: string;
  kcal: string;
  desc: string;
};

export const RECIPES: Recipe[] = [
  {
    img: "/ikram/recipe-chia.webp",
    alt: "Muz ve cevizle süslenmiş yulaflı chia puding",
    title: "Yulaflı Chia Puding",
    time: "10 dk + dinlenme",
    kcal: "~280 kcal",
    desc: "Akşamdan hazırlanan, lif ve omega-3 açısından zengin doyurucu bir kahvaltı.",
  },
  {
    img: "/ikram/recipe-cookie.webp",
    alt: "El yapımı sağlıklı yulaflı fit kurabiyeler",
    title: "Fit Kurabiye",
    time: "20 dk",
    kcal: "~90 kcal / adet",
    desc: "Rafine şeker içermeyen, yulaf ve muz tabanlı pratik atıştırmalık.",
  },
  {
    img: "/ikram/recipe-smoothie.webp",
    alt: "Nane yapraklı yeşil detoks smoothie",
    title: "Yeşil Detoks Smoothie",
    time: "5 dk",
    kcal: "~160 kcal",
    desc: "Ispanak, yeşil elma ve nane ile güne hafif ve enerjik bir başlangıç.",
  },
  {
    img: "/ikram/recipe-salad.webp",
    alt: "Taze yeşilliklerle glutensiz karabuğday salatası",
    title: "Glutensiz Karabuğday Salatası",
    time: "15 dk",
    kcal: "~320 kcal",
    desc: "Bitkisel protein ve lif dolu, öğle öğünleri için ideal glutensiz seçenek.",
  },
];

export type BlogPost = {
  category: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
};

export const BLOG: BlogPost[] = [
  {
    category: "Kilo Yönetimi",
    date: "12 Haziran 2026",
    read: "4 dk okuma",
    title: "Kilo Vermeyi Zorlaştıran 5 Hata",
    excerpt:
      "Çoğu zaman sorun irade değil, fark etmeden tekrarladığımız alışkanlıklar. En sık karşılaştığım beş hataya bakıyoruz.",
  },
  {
    category: "İnsülin Direnci",
    date: "3 Haziran 2026",
    read: "5 dk okuma",
    title: "İnsülin Direncinde Beslenme Önerileri",
    excerpt:
      "Kan şekerini dengede tutan öğün düzeni ve tabak kurulumu ile enerjinizi gün boyu koruyabilirsiniz.",
  },
  {
    category: "Yeme Davranışı",
    date: "24 Mayıs 2026",
    read: "4 dk okuma",
    title: "Duygusal Yeme ile Nasıl Baş Edilir?",
    excerpt:
      "Açlık ile isteği ayırt etmeyi öğrenmek, yemekle kurduğunuz ilişkiyi dönüştürmenin ilk adımıdır.",
  },
  {
    category: "Sporcu Beslenmesi",
    date: "15 Mayıs 2026",
    read: "3 dk okuma",
    title: "Spor Sonrası Ne Yemeliyiz?",
    excerpt:
      "Antrenman sonrası doğru protein ve karbonhidrat dengesi, toparlanmayı ve performansı destekler.",
  },
];

export type Testimonial = { name: string; text: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Büşra K.",
    text: "İkram Hanım sayesinde hem kilo verdim hem de yeme düzenimi tamamen değiştirdim.",
  },
  {
    name: "Merve A.",
    text: "Sürecimde bana özel hazırlandığını hissettiğim bir programla ilerledim.",
  },
  {
    name: "Selen T.",
    text: "Gerçekten işini aşkla yapan, motive eden ve her zaman destek olan bir diyetisyen.",
  },
];

export type Faq = { q: string; a: string };

export const FAQ: Faq[] = [
  {
    q: "Online danışmanlık nasıl ilerliyor?",
    a: "İlk görüşmeyi görüntülü olarak yapıyoruz. Ardından size özel beslenme planınızı hazırlıyor, haftalık takip ve WhatsApp desteğiyle süreci birlikte yönetiyoruz. Türkiye’nin her yerinden katılabilirsiniz.",
  },
  {
    q: "İlk görüşmede neler yapılıyor?",
    a: "Sağlık geçmişinizi, yaşam tarzınızı, beslenme alışkanlıklarınızı ve hedeflerinizi detaylıca konuşuyoruz. Bu değerlendirme, planınızın tamamen size uygun olmasının temelini oluşturuyor.",
  },
  {
    q: "Programlar kişiye özel mi?",
    a: "Evet. Hazır listeler vermiyorum; her plan sizin damak tadınıza, günlük rutininize, bütçenize ve sağlık durumunuza göre hazırlanıyor.",
  },
  {
    q: "Ne kadar sürede sonuç alınır?",
    a: "Süreç kişiden kişiye değişir. Amacım hızlı ve geçici değil; sürdürülebilir, kalıcı bir değişim. Düzenli takip ile ilk haftalardan itibaren alışkanlıklarınızda somut değişimler görmeye başlarsınız.",
  },
  {
    q: "WhatsApp üzerinden destek var mı?",
    a: "Evet. Program süresince sorularınız için WhatsApp üzerinden ulaşabilir, süreç boyunca yanınızda olduğumu hissedebilirsiniz.",
  },
  {
    q: "Yüz yüze görüşmeler nerede yapılıyor?",
    a: "Yüz yüze görüşmeler Bahçelievler, İstanbul’daki danışmanlık ofisinde gerçekleşiyor. Randevu için WhatsApp’tan yazmanız yeterli.",
  },
];

export const FOOTER_LEGAL = ["KVKK", "Gizlilik Politikası", "Aydınlatma Metni"];
