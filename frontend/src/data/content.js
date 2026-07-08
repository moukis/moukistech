import {
  Stethoscope, Cpu, Monitor, BatteryCharging, Keyboard, HardDrive,
  MemoryStick, Wrench, Apple, DatabaseBackup, ShieldCheck, Gauge,
  Laptop, MemoryStick as Ram, Plug, SquareStack,
} from "lucide-react";

export const CONTACT = {
  phone: "+33 7 58 96 46 20",
  phoneRaw: "+33758964620",
  whatsapp: "33758964620",
  email: "rewllasy@gmail.com",
  owner: "SYLLA Mactar",
  brand: "Moukis tech",
  country: "France",
};

export const SERVICES = [
  { icon: Stethoscope, title: "Diagnostic Complet", desc: "Analyse approfondie pour identifier précisément l'origine de la panne, sans surprise." },
  { icon: Cpu, title: "Réparation Carte Mère", desc: "Micro-soudure et réparation de composants au niveau des circuits imprimés." },
  { icon: Monitor, title: "Remplacement d'Écran", desc: "Dalles de qualité d'origine pour un affichage net et sans défaut." },
  { icon: BatteryCharging, title: "Remplacement Batterie", desc: "Retrouvez une autonomie complète avec des batteries certifiées." },
  { icon: Keyboard, title: "Réparation Clavier", desc: "Touches défectueuses ou clavier complet remplacé rapidement." },
  { icon: HardDrive, title: "Passage au SSD", desc: "Démarrage ultra-rapide et fiabilité accrue grâce au stockage SSD." },
  { icon: MemoryStick, title: "Extension RAM", desc: "Plus de mémoire pour un multitâche fluide et sans ralentissement." },
  { icon: Wrench, title: "Installation Windows", desc: "Installation propre et optimisée de Windows avec tous les pilotes." },
  { icon: Apple, title: "Installation macOS", desc: "Configuration et réinstallation de macOS dans les règles de l'art." },
  { icon: DatabaseBackup, title: "Récupération de Données", desc: "Sauvegarde et récupération de vos fichiers précieux, même après panne." },
  { icon: ShieldCheck, title: "Suppression de Virus", desc: "Nettoyage complet des malwares et sécurisation de votre système." },
  { icon: Gauge, title: "Optimisation Performances", desc: "Réglages avancés pour retrouver la vitesse d'un appareil neuf." },
];

export const WHY = [
  { n: "01", title: "Technicien Expérimenté", desc: "Des années d'expertise sur toutes les marques et modèles d'ordinateurs portables." },
  { n: "02", title: "Intervention Rapide", desc: "Diagnostic sous 24h et réparations livrées dans les meilleurs délais." },
  { n: "03", title: "Prix Honnêtes", desc: "Des devis clairs et transparents, sans frais cachés ni mauvaises surprises." },
  { n: "04", title: "Pièces de Qualité", desc: "Uniquement des composants d'origine ou équivalents certifiés." },
  { n: "05", title: "Support Fiable", desc: "Un accompagnement humain, avant, pendant et après la réparation." },
];

export const TESTIMONIALS = [
  { name: "Camille Laurent", role: "Graphiste indépendante", text: "Mon MacBook ne démarrait plus la veille d'un rendu client. Réparé et récupéré en 24h. Un vrai sauveur, service impeccable.", rating: 5 },
  { name: "Thomas Berger", role: "Étudiant en informatique", text: "Passage au SSD et extension RAM : mon portable est comme neuf, deux fois plus rapide. Prix honnête et conseils clairs.", rating: 5 },
  { name: "Sophie Moreau", role: "Chef de projet", text: "Écran fissuré remplacé en un temps record avec une dalle parfaite. Communication transparente du début à la fin.", rating: 5 },
  { name: "Karim Benali", role: "Photographe", text: "Récupération de données après un crash disque : tout retrouvé. Professionnalisme et honnêteté au rendez-vous.", rating: 5 },
];

export const GALLERY = [
  { url: "https://images.pexels.com/photos/7639374/pexels-photo-7639374.jpeg", label: "Réparation de carte" },
  { url: "https://images.pexels.com/photos/9242899/pexels-photo-9242899.jpeg", label: "Assemblage composants" },
  { url: "https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg", label: "Atelier technique" },
  { url: "https://images.pexels.com/photos/6636474/pexels-photo-6636474.jpeg", label: "Modules RAM & SSD" },
  { url: "https://images.pexels.com/photos/6372919/pexels-photo-6372919.jpeg", label: "Contrôle qualité" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475", label: "Micro-électronique" },
];

export const STORE = [
  { icon: Laptop, name: "PC Portables Reconditionnés" },
  { icon: HardDrive, name: "Disques SSD" },
  { icon: Ram, name: "Barrettes de RAM" },
  { icon: Plug, name: "Chargeurs & Adaptateurs" },
  { icon: Keyboard, name: "Claviers" },
  { icon: Monitor, name: "Écrans & Dalles" },
  { icon: SquareStack, name: "Accessoires" },
];

export const FAQ = [
  { q: "Combien coûte un diagnostic ?", a: "Le diagnostic est offert pour toute réparation confiée. Vous recevez un devis clair et sans engagement avant toute intervention." },
  { q: "Quel est le délai moyen d'une réparation ?", a: "La plupart des réparations courantes (écran, batterie, SSD) sont réalisées sous 24 à 48h selon la disponibilité des pièces." },
  { q: "Utilisez-vous des pièces d'origine ?", a: "Oui, nous privilégions systématiquement des pièces d'origine ou des équivalents certifiés de haute qualité." },
  { q: "Mes données sont-elles en sécurité ?", a: "Absolument. La confidentialité de vos données est notre priorité. Nous proposons aussi la sauvegarde et la récupération sécurisée." },
  { q: "Intervenez-vous sur les Mac et les PC ?", a: "Oui, nous prenons en charge toutes les marques : Windows, macOS, ainsi que Linux sur demande." },
  { q: "Offrez-vous une garantie sur les réparations ?", a: "Chaque réparation est couverte par une garantie sur la pièce et la main d'œuvre. Nous restons disponibles après l'intervention." },
];
