export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

type Dictionary = {
  nav: {
    home: string;
    services: string;
    demos: string;
    packages: string;
    about: string;
    contact: string;
    cta: string;
    whatsapp: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    stats: { value: string; label: string }[];
  };
  value: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  services: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  demos: {
    title: string;
    subtitle: string;
    ready: string;
    soon: string;
    open: string;
    problemLabel: string;
    solutionLabel: string;
    featuresLabel: string;
    items: {
      slug: string;
      name: string;
      type: string;
      status: "ready" | "soon";
      problem: string;
      solution: string;
      features: string[];
      href?: string;
    }[];
  };
  packages: {
    title: string;
    subtitle: string;
    popular: string;
    cta: string;
    note: string;
    items: {
      name: string;
      tagline: string;
      price: string;
      period: string;
      features: string[];
      highlighted?: boolean;
    }[];
  };
  about: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    highlights: { value: string; label: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    linkedin: string;
    website: string;
    copy: string;
    copied: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
  footer: {
    tagline: string;
    rights: string;
    nav: string;
    social: string;
  };
  demoPages: {
    backHome: string;
    comingSoon: string;
    comingSoonDesc: string;
    contactCta: string;
    previewLabel: string;
    benefitsTitle: string;
    benefits: string[];
    stickyCta: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      services: "Hizmetler",
      demos: "Demolar",
      packages: "Paketler",
      about: "Hakkımda",
      contact: "İletişim",
      cta: "Görüşme Ayarla",
      whatsapp: "WhatsApp",
    },
    hero: {
      badge: "İşletmeler için dijital çözümler",
      title:
        "İşletmenizi dijitalde daha profesyonel, daha hızlı ve daha görünür hale getiriyorum.",
      subtitle:
        "Web sitesi, CRM, randevu sistemleri ve dijital çözümlerle işletmenizin daha fazla müşteriye ulaşmasına yardımcı oluyorum.",
      primary: "Demoları Gör",
      secondary: "WhatsApp'tan İletişime Geç",
      stats: [
        { value: "10sn", label: "İlk izlenim" },
        { value: "7/24", label: "Online randevu" },
        { value: "%100", label: "Size özel tasarım" },
      ],
    },
    value: {
      title: "İşletmenize Nasıl Katkı Sağlıyorum?",
      subtitle:
        "Hazır şablonlarla değil; işletmenizin hedeflerine göre tasarlanmış çözümlerle gerçek sonuçlar.",
      items: [
        {
          title: "Daha Profesyonel Görünüm",
          description:
            "İşletmeniz ilk saniyede güven veren, modern ve premium bir dijital kimliğe kavuşur.",
        },
        {
          title: "Daha Fazla Müşteri",
          description:
            "Ziyaretçileri müşteriye dönüştüren, net ve ikna edici bir dijital deneyim kurguluyorum.",
        },
        {
          title: "Daha Kolay Randevu Yönetimi",
          description:
            "Müşterileriniz 7/24 online randevu alır, siz takvimi tek ekrandan yönetirsiniz.",
        },
        {
          title: "Google'da Daha Güçlü Görünürlük",
          description:
            "SEO uyumlu altyapı ile potansiyel müşterileriniz sizi aradığında ilk sırada bulur.",
        },
        {
          title: "Daha Hızlı İletişim",
          description:
            "WhatsApp, telefon ve form entegrasyonlarıyla müşterileriniz tek dokunuşla size ulaşır.",
        },
        {
          title: "Daha Az Manuel İş",
          description:
            "Otomasyonlarla tekrar eden işleri ortadan kaldırır, zamanınızı işinize ayırırsınız.",
        },
      ],
    },
    services: {
      title: "Hizmetler",
      subtitle:
        "İşletmenizin dijital varlığını uçtan uca kuran ve büyüten çözümler.",
      items: [
        {
          title: "Modern Web Sitesi",
          description:
            "Hızlı, mobil uyumlu ve markanızı premium gösteren, dönüşüm odaklı web siteleri.",
        },
        {
          title: "CRM Sistemi",
          description:
            "Müşterilerinizi, takiplerinizi ve satışlarınızı tek panelden yönetin.",
        },
        {
          title: "Online Randevu Sistemi",
          description:
            "Otomatik hatırlatmalar ve takvim entegrasyonu ile randevu kayıplarını bitirin.",
        },
        {
          title: "Google SEO",
          description:
            "Yerel aramalarda öne çıkın, daha fazla organik müşteri trafiği kazanın.",
        },
        {
          title: "Sosyal Medya Çözümleri",
          description:
            "Tutarlı ve profesyonel bir sosyal medya görünümü ile markanızı güçlendirin.",
        },
        {
          title: "AI Otomasyonları",
          description:
            "Yapay zekâ destekli iş akışlarıyla tekrar eden görevleri otomatikleştirin.",
        },
      ],
    },
    demos: {
      title: "Demolar",
      subtitle:
        "Farklı sektörler için tasarladığım gerçek ürün örneklerini inceleyin.",
      ready: "Hazır Demo",
      soon: "Yakında",
      open: "Demoyu Aç",
      problemLabel: "Sorun",
      solutionLabel: "Çözüm",
      featuresLabel: "Öne Çıkan Özellikler",
      items: [
        {
          slug: "puruze-caffe",
          name: "Püruze Caffe Web Sitesi Yenileme",
          type: "Kafe / Restoran Web Sitesi",
          status: "ready",
          href: "/puruze-caffe",
          problem:
            "Eski, Wix tarzı site; zayıf görsel sunum, net çağrı butonları ve mobil deneyim eksik.",
          solution:
            "Kuzguncuk'ta yer alan Püruze Caffe için hazırlanan premium web sitesi demo çalışması.",
          features: [
            "Sıcak, premium kafe tasarımı",
            "Menü, galeri ve sosyal kanıt",
            "Yol tarifi, rezervasyon ve arama",
            "Mobil öncelikli ve SEO uyumlu",
          ],
        },
        {
          slug: "beauty-crm",
          name: "Güzellik Kliniği CRM",
          type: "Güzellik & Estetik",
          status: "ready",
          problem:
            "Randevular dağınık, müşteri geçmişi takip edilemiyor, satışlar kaçıyor.",
          solution:
            "Müşteri, randevu ve satış takibini tek panelde toplayan özel CRM.",
          features: [
            "Müşteri kartları ve geçmiş",
            "Otomatik randevu hatırlatma",
            "Paket ve seans takibi",
            "Gelir raporları",
          ],
        },
        {
          slug: "barber",
          name: "Berber Web Sitesi",
          type: "Berber & Kuaför",
          status: "ready",
          problem:
            "Telefonla randevu yoğunluğu, kaçan müşteriler ve zayıf dijital görünüm.",
          solution:
            "Online randevu alan, hizmetleri sergileyen modern bir web sitesi.",
          features: [
            "Online randevu",
            "Hizmet ve fiyat vitrini",
            "Galeri ve yorumlar",
            "Harita ve iletişim",
          ],
        },
        {
          slug: "clinic",
          name: "Klinik Randevu Sistemi",
          type: "Sağlık & Klinik",
          status: "ready",
          problem:
            "Hasta yoğunluğu, çakışan randevular ve manuel takip yükü.",
          solution:
            "Hekim takvimine entegre, otomatik onaylı online randevu sistemi.",
          features: [
            "Hekim bazlı takvim",
            "Otomatik onay & hatırlatma",
            "Hasta kayıt formu",
            "SMS / WhatsApp bildirimi",
          ],
        },
        {
          slug: "real-estate",
          name: "Emlak Platformu",
          type: "Emlak & Gayrimenkul",
          status: "soon",
          problem:
            "İlanlar dağınık, portföy yönetimi zor, müşteri eşleştirmesi yavaş.",
          solution:
            "Filtrelenebilir ilan vitrini ve portföy yönetim paneli.",
          features: [
            "Gelişmiş ilan filtreleme",
            "Portföy yönetimi",
            "Harita üzerinde ilanlar",
            "Talep eşleştirme",
          ],
        },
        {
          slug: "restaurant",
          name: "Restoran Web Sitesi",
          type: "Restoran & Kafe",
          status: "soon",
          problem:
            "Dijital menü yok, rezervasyon telefonla, online görünürlük zayıf.",
          solution:
            "Dijital menü, online rezervasyon ve sipariş yönlendirmeli site.",
          features: [
            "Dijital menü",
            "Online rezervasyon",
            "Sipariş yönlendirme",
            "Galeri ve kampanyalar",
          ],
        },
      ],
    },
    packages: {
      title: "Paketler",
      subtitle:
        "İşletmenizin büyüklüğüne ve hedeflerine göre esnek çözümler. Fiyatlar görüşmeye özeldir.",
      popular: "En Çok Tercih Edilen",
      cta: "Teklif Al",
      note: "Her paket işletmenize göre özelleştirilir. Net fiyat için iletişime geçin.",
      items: [
        {
          name: "Başlangıç",
          tagline: "Dijitalde güçlü bir ilk adım",
          price: "Özel",
          period: "teklif",
          features: [
            "Modern tek sayfa web sitesi",
            "Mobil uyumlu tasarım",
            "WhatsApp & iletişim entegrasyonu",
            "Temel SEO kurulumu",
          ],
        },
        {
          name: "Profesyonel",
          tagline: "Büyümek isteyen işletmeler için",
          price: "Özel",
          period: "teklif",
          highlighted: true,
          features: [
            "Çok sayfalı premium web sitesi",
            "Online randevu sistemi",
            "Gelişmiş SEO & Google görünürlük",
            "İçerik ve galeri yönetimi",
            "Öncelikli destek",
          ],
        },
        {
          name: "Büyüme",
          tagline: "Tam kapsamlı dijital dönüşüm",
          price: "Özel",
          period: "teklif",
          features: [
            "Profesyonel paketteki her şey",
            "Özel CRM sistemi",
            "AI otomasyonları",
            "Sosyal medya çözümleri",
            "Sürekli bakım & danışmanlık",
          ],
        },
      ],
    },
    about: {
      title: "Hakkımda",
      subtitle: "Tanışalım",
      paragraphs: [
        "Ben Cenk Emir Bat.",
        "Finlandiya'da Entrepreneurship & International Business alanında yüksek lisans yapıyorum. Aynı zamanda işletmeler için modern web siteleri, CRM sistemleri, online randevu çözümleri ve dijital büyümeyi destekleyen yazılım çözümleri geliştiriyorum.",
        "Her işletmenin ihtiyaçlarının farklı olduğuna inanıyorum. Bu yüzden hazır şablonlar yerine, işletmenizin hedeflerine uygun, modern ve kullanıcı odaklı çözümler tasarlıyorum.",
        "Amacım; küçük ve orta ölçekli işletmelerin dijital dünyada daha profesyonel görünmesini, daha fazla müşteriye ulaşmasını ve iş süreçlerini daha verimli hale getirmesini sağlamak.",
      ],
      highlights: [
        { value: "MSc", label: "Entrepreneurship & Int. Business" },
        { value: "Finlandiya", label: "Merkez" },
        { value: "Uçtan uca", label: "Dijital çözümler" },
      ],
    },
    contact: {
      title: "İletişim",
      subtitle:
        "Projenizi konuşalım. Size en uygun çözümü birlikte planlayalım.",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      email: "E-posta",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      website: "Web Sitesi",
      copy: "Kopyala",
      copied: "Kopyalandı",
      ctaTitle: "İşletmenizi bir üst seviyeye taşıyalım.",
      ctaSubtitle:
        "Birkaç dakikalık bir görüşme, işletmenizin dijital geleceğini değiştirebilir.",
      ctaButton: "WhatsApp'tan Yazın",
    },
    footer: {
      tagline: "Web • CRM • Dijital Büyüme",
      rights: "Tüm hakları saklıdır.",
      nav: "Menü",
      social: "Sosyal",
    },
    demoPages: {
      backHome: "Ana Sayfaya Dön",
      comingSoon: "Bu demo hazırlanıyor",
      comingSoonDesc:
        "Bu sektöre özel demo şu anda geliştiriliyor. Detaylar için benimle iletişime geçebilirsiniz.",
      contactCta: "İletişime Geç",
      previewLabel: "Canlı Önizleme",
      benefitsTitle: "İşletmenize Kazanımları",
      benefits: [
        "Daha profesyonel bir dijital görünüm",
        "Daha fazla müşteri ve dönüşüm",
        "Daha az manuel iş, daha çok otomasyon",
        "Her cihazda hızlı ve kusursuz deneyim",
      ],
      stickyCta: "WhatsApp'tan Sor",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      demos: "Demos",
      packages: "Packages",
      about: "About",
      contact: "Contact",
      cta: "Book a Call",
      whatsapp: "WhatsApp",
    },
    hero: {
      badge: "Digital solutions for businesses",
      title:
        "I make your business more professional, faster and more visible online.",
      subtitle:
        "With websites, CRM, appointment systems and digital solutions, I help your business reach more customers.",
      primary: "View Demos",
      secondary: "Message on WhatsApp",
      stats: [
        { value: "10s", label: "First impression" },
        { value: "24/7", label: "Online booking" },
        { value: "100%", label: "Tailored design" },
      ],
    },
    value: {
      title: "How I Add Value to Your Business",
      subtitle:
        "Not off-the-shelf templates — real results from solutions designed around your goals.",
      items: [
        {
          title: "A More Professional Look",
          description:
            "Your business gains a modern, premium digital identity that builds trust in the first second.",
        },
        {
          title: "More Customers",
          description:
            "I craft a clear, persuasive digital experience that turns visitors into customers.",
        },
        {
          title: "Easier Appointment Management",
          description:
            "Your customers book 24/7 online while you manage everything from a single screen.",
        },
        {
          title: "Stronger Visibility on Google",
          description:
            "An SEO-ready foundation puts you at the top when potential customers search for you.",
        },
        {
          title: "Faster Communication",
          description:
            "With WhatsApp, phone and form integrations, customers reach you in a single tap.",
        },
        {
          title: "Less Manual Work",
          description:
            "Automations remove repetitive tasks so you can focus your time on your business.",
        },
      ],
    },
    services: {
      title: "Services",
      subtitle:
        "Solutions that build and grow your digital presence end to end.",
      items: [
        {
          title: "Modern Website",
          description:
            "Fast, mobile-friendly, conversion-focused websites that make your brand look premium.",
        },
        {
          title: "CRM System",
          description:
            "Manage your customers, follow-ups and sales from a single dashboard.",
        },
        {
          title: "Online Booking System",
          description:
            "End no-shows with automated reminders and calendar integration.",
        },
        {
          title: "Google SEO",
          description:
            "Stand out in local search and win more organic customer traffic.",
        },
        {
          title: "Social Media Solutions",
          description:
            "Strengthen your brand with a consistent, professional social media presence.",
        },
        {
          title: "AI Automations",
          description:
            "Automate repetitive tasks with AI-powered workflows.",
        },
      ],
    },
    demos: {
      title: "Demos",
      subtitle:
        "Explore real product examples I've designed for different industries.",
      ready: "Live Demo",
      soon: "Coming Soon",
      open: "Open Demo",
      problemLabel: "Problem",
      solutionLabel: "Solution",
      featuresLabel: "Key Features",
      items: [
        {
          slug: "puruze-caffe",
          name: "Püruze Caffe Website Redesign",
          type: "Cafe / Restaurant Website",
          status: "ready",
          href: "/puruze-caffe",
          problem:
            "An outdated, Wix-like site with weak visuals, unclear CTAs and a poor mobile experience.",
          solution:
            "A premium website demo crafted for Püruze Caffe, a cozy cafe in Kuzguncuk, İstanbul.",
          features: [
            "Warm, premium cafe design",
            "Menu, gallery & social proof",
            "Directions, reservation & call",
            "Mobile-first and SEO-friendly",
          ],
        },
        {
          slug: "beauty-crm",
          name: "Beauty Clinic CRM",
          type: "Beauty & Aesthetics",
          status: "ready",
          problem:
            "Scattered appointments, untracked customer history and lost sales.",
          solution:
            "A custom CRM bringing customers, appointments and sales into one panel.",
          features: [
            "Customer profiles & history",
            "Automated appointment reminders",
            "Package & session tracking",
            "Revenue reports",
          ],
        },
        {
          slug: "barber",
          name: "Barber Website",
          type: "Barber & Salon",
          status: "ready",
          problem:
            "Overwhelming phone bookings, lost customers and a weak digital presence.",
          solution:
            "A modern website that takes online bookings and showcases services.",
          features: [
            "Online booking",
            "Service & price showcase",
            "Gallery & reviews",
            "Map & contact",
          ],
        },
        {
          slug: "clinic",
          name: "Clinic Appointment System",
          type: "Healthcare & Clinic",
          status: "ready",
          problem:
            "Patient load, overlapping appointments and manual tracking overhead.",
          solution:
            "An online booking system integrated with the doctor's calendar with auto-confirmation.",
          features: [
            "Per-doctor calendar",
            "Auto confirm & reminders",
            "Patient intake form",
            "SMS / WhatsApp notifications",
          ],
        },
        {
          slug: "real-estate",
          name: "Real Estate Platform",
          type: "Real Estate",
          status: "soon",
          problem:
            "Scattered listings, hard portfolio management and slow customer matching.",
          solution:
            "A filterable listing showcase with a portfolio management panel.",
          features: [
            "Advanced listing filters",
            "Portfolio management",
            "Listings on the map",
            "Demand matching",
          ],
        },
        {
          slug: "restaurant",
          name: "Restaurant Website",
          type: "Restaurant & Café",
          status: "soon",
          problem:
            "No digital menu, phone-only reservations and weak online visibility.",
          solution:
            "A site with a digital menu, online reservations and order routing.",
          features: [
            "Digital menu",
            "Online reservations",
            "Order routing",
            "Gallery & promotions",
          ],
        },
      ],
    },
    packages: {
      title: "Packages",
      subtitle:
        "Flexible solutions for your business size and goals. Pricing is tailored per project.",
      popular: "Most Popular",
      cta: "Get a Quote",
      note: "Every package is customized to your business. Contact me for exact pricing.",
      items: [
        {
          name: "Starter",
          tagline: "A strong first step online",
          price: "Custom",
          period: "quote",
          features: [
            "Modern single-page website",
            "Mobile-friendly design",
            "WhatsApp & contact integration",
            "Basic SEO setup",
          ],
        },
        {
          name: "Professional",
          tagline: "For businesses ready to grow",
          price: "Custom",
          period: "quote",
          highlighted: true,
          features: [
            "Multi-page premium website",
            "Online appointment system",
            "Advanced SEO & Google visibility",
            "Content & gallery management",
            "Priority support",
          ],
        },
        {
          name: "Growth",
          tagline: "Full-scale digital transformation",
          price: "Custom",
          period: "quote",
          features: [
            "Everything in Professional",
            "Custom CRM system",
            "AI automations",
            "Social media solutions",
            "Ongoing maintenance & consulting",
          ],
        },
      ],
    },
    about: {
      title: "About",
      subtitle: "Nice to meet you",
      paragraphs: [
        "I'm Cenk Emir Bat.",
        "I'm currently pursuing a Master's degree in Entrepreneurship & International Business in Finland while building digital solutions for local businesses.",
        "I design modern websites, CRM systems, appointment platforms and business automation tools that help companies operate more efficiently and present a stronger digital presence.",
        "Rather than using generic templates, I focus on creating solutions tailored to each business's goals. My mission is to help small and medium-sized businesses grow faster, appear more professional and attract more customers through modern technology.",
      ],
      highlights: [
        { value: "MSc", label: "Entrepreneurship & Int. Business" },
        { value: "Finland", label: "Based in" },
        { value: "End-to-end", label: "Digital solutions" },
      ],
    },
    contact: {
      title: "Contact",
      subtitle:
        "Let's talk about your project and plan the right solution together.",
      phone: "Phone",
      whatsapp: "WhatsApp",
      email: "Email",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      website: "Website",
      copy: "Copy",
      copied: "Copied",
      ctaTitle: "Let's take your business to the next level.",
      ctaSubtitle:
        "A few minutes of conversation can change the digital future of your business.",
      ctaButton: "Message on WhatsApp",
    },
    footer: {
      tagline: "Web • CRM • Digital Growth",
      rights: "All rights reserved.",
      nav: "Menu",
      social: "Social",
    },
    demoPages: {
      backHome: "Back to Home",
      comingSoon: "This demo is in progress",
      comingSoonDesc:
        "A demo tailored to this industry is currently being built. Reach out for details.",
      contactCta: "Get in Touch",
      previewLabel: "Live Preview",
      benefitsTitle: "What Your Business Gains",
      benefits: [
        "A more professional digital presence",
        "More customers and conversions",
        "Less manual work, more automation",
        "A fast, flawless experience on every device",
      ],
      stickyCta: "Ask on WhatsApp",
    },
  },
};

export const siteConfig = {
  name: "Cenk Emir Bat",
  phone: "+358449510090",
  phoneDisplay: "+358 44 951 0090",
  email: "cenkemirbat@gmail.com",
  whatsapp: "https://wa.me/358449510090",
  instagram: "https://instagram.com/cnkbat",
  linkedin: "https://tr.linkedin.com/in/cenkemirbat123",
  url: "https://cenk-emir-bat.vercel.app",
};
