export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

type DemoStatus = "live" | "ready" | "new";

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
    open: string;
    badges: Record<DemoStatus, string>;
    items: {
      slug: string;
      name: string;
      type: string;
      status: DemoStatus;
      href: string;
      value: string;
      features: string[];
      image: string;
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
        "Sadece web sitesi değil — yerel işletmeler için tasarladığım sektöre özel dijital işletme sistemleri.",
      open: "Demoyu Aç",
      badges: { live: "Canlı Demo", ready: "Hazır Demo", new: "Yeni" },
      items: [
        {
          slug: "puruze-caffe",
          name: "Püruze Caffe",
          type: "Kafe Web Sitesi · Yenileme",
          status: "live",
          href: "/puruze-caffe",
          value:
            "Kuzguncuk'taki Püruze Caffe için sıcak, premium ve mobil öncelikli web sitesi yenilemesi.",
          features: [
            "Menü, galeri ve rezervasyon",
            "Yol tarifi ve tek dokunuş arama",
            "SEO uyumlu, hızlı altyapı",
          ],
          image: "/assets/puruze-caffe-preview.webp",
        },
        {
          slug: "kuafor-os",
          name: "Kuaför OS",
          type: "Berber & Kuaför Yönetim Sistemi",
          status: "ready",
          href: "/demos/kuafor-os",
          value:
            "Randevudan gelire kadar tüm salonu tek panelden yöneten dijital işletme sistemi.",
          features: [
            "Online randevu & WhatsApp hatırlatma",
            "Personel ve müşteri yönetimi",
            "Gelir ve performans paneli",
          ],
          image: "/assets/barber-preview.webp",
        },
        {
          slug: "beauty-center-crm",
          name: "Beauty Center CRM",
          type: "Güzellik & Estetik CRM",
          status: "ready",
          href: "/demos/beauty-center-crm",
          value:
            "Müşteri, randevu, paket ve seans takibini tek panelde toplayan estetik merkezi CRM'i.",
          features: [
            "Paket ve seans takibi",
            "Müşteri kartları ve geçmiş",
            "Otomatik hatırlatma & gelir raporu",
          ],
          image: "/assets/beauty-crm-preview.webp",
        },
        {
          slug: "clinic-os",
          name: "ClinicOS",
          type: "Klinik & Hasta Yönetimi",
          status: "new",
          href: "/demos/clinic-os",
          value:
            "Hekim takvimi, hasta kayıtları ve ödeme takibini tek ekranda birleştiren klinik sistemi.",
          features: [
            "Hekim bazlı takvim",
            "Hasta kayıt ve geçmişi",
            "Ödeme ve hatırlatma takibi",
          ],
          image: "/assets/clinic-preview.webp",
        },
        {
          slug: "estate-os",
          name: "EstateOS",
          type: "Emlak Yönetim Platformu",
          status: "new",
          href: "/demos/estate-os",
          value:
            "Portföy, ilanlar, müşteriler ve satış sürecini tek platformda yöneten emlak işletme sistemi.",
          features: [
            "Portföy ve ilan yönetimi",
            "Satış süreci takibi",
            "Komisyon ve danışman paneli",
          ],
          image: "/assets/real-estate-preview.webp",
        },
        {
          slug: "restaurant-os",
          name: "RestaurantOS",
          type: "Restoran & Kafe Yönetimi",
          status: "new",
          href: "/demos/restaurant-os",
          value:
            "Dijital menü, QR sipariş, rezervasyon ve masa yönetimini tek sistemde toplayan çözüm.",
          features: [
            "QR dijital menü",
            "Masa ve rezervasyon yönetimi",
            "Günlük satış ve kampanyalar",
          ],
          image: "/assets/restaurant-preview.webp",
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
          description: "Automate repetitive tasks with AI-powered workflows.",
        },
      ],
    },
    demos: {
      title: "Demos",
      subtitle:
        "Not just websites — sector-specific digital business systems I design for local businesses.",
      open: "Open Demo",
      badges: { live: "Live Demo", ready: "Ready Demo", new: "New" },
      items: [
        {
          slug: "puruze-caffe",
          name: "Püruze Caffe",
          type: "Cafe Website · Redesign",
          status: "live",
          href: "/puruze-caffe",
          value:
            "A warm, premium, mobile-first website redesign for Püruze Caffe in Kuzguncuk, İstanbul.",
          features: [
            "Menu, gallery & reservations",
            "Directions & one-tap call",
            "Fast, SEO-friendly foundation",
          ],
          image: "/assets/puruze-caffe-preview.webp",
        },
        {
          slug: "kuafor-os",
          name: "Kuaför OS",
          type: "Barber & Salon Management System",
          status: "ready",
          href: "/demos/kuafor-os",
          value:
            "A digital operating system that runs the whole salon — from booking to revenue — in one panel.",
          features: [
            "Online booking & WhatsApp reminders",
            "Staff & customer management",
            "Revenue & performance dashboard",
          ],
          image: "/assets/barber-preview.webp",
        },
        {
          slug: "beauty-center-crm",
          name: "Beauty Center CRM",
          type: "Beauty & Aesthetics CRM",
          status: "ready",
          href: "/demos/beauty-center-crm",
          value:
            "A CRM that brings customers, appointments, packages and session tracking into one panel.",
          features: [
            "Package & session tracking",
            "Customer profiles & history",
            "Automated reminders & revenue reports",
          ],
          image: "/assets/beauty-crm-preview.webp",
        },
        {
          slug: "clinic-os",
          name: "ClinicOS",
          type: "Clinic & Patient Management",
          status: "new",
          href: "/demos/clinic-os",
          value:
            "A clinic system uniting doctor calendars, patient records and payment tracking on one screen.",
          features: [
            "Per-doctor calendar",
            "Patient records & history",
            "Payment & reminder tracking",
          ],
          image: "/assets/clinic-preview.webp",
        },
        {
          slug: "estate-os",
          name: "EstateOS",
          type: "Real Estate Platform",
          status: "new",
          href: "/demos/estate-os",
          value:
            "A real estate operating system managing portfolio, listings, clients and leads in one place.",
          features: [
            "Portfolio & listing management",
            "Lead pipeline tracking",
            "Commission & agent dashboard",
          ],
          image: "/assets/real-estate-preview.webp",
        },
        {
          slug: "restaurant-os",
          name: "RestaurantOS",
          type: "Restaurant & Café Management",
          status: "new",
          href: "/demos/restaurant-os",
          value:
            "A system uniting digital menu, QR ordering, reservations and table management.",
          features: [
            "QR digital menu",
            "Table & reservation management",
            "Daily sales & campaigns",
          ],
          image: "/assets/restaurant-preview.webp",
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
