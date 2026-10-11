export type DepartmentId = 'tech' | 'business' | 'health' | 'travel' | 'academic' | 'general';
export type DepartmentMeta = {
  id: DepartmentId; nameEn: string; nameFr: string; descriptionFr: string;
};

export const DEPARTMENTS: DepartmentMeta[] = [
  { id: 'tech', nameEn: 'Tech English', nameFr: 'Anglais de la technologie',
    descriptionFr: "Pour les personnes intéressées par l'informatique, le développement logiciel, l'intelligence artificielle, les outils numériques et la communication technique." },
  { id: 'business', nameEn: 'Business English', nameFr: 'Anglais des affaires',
    descriptionFr: "Pour apprendre les expressions commerciales, la vente, la négociation, les réunions, l'entrepreneuriat et la communication professionnelle." },
  { id: 'health', nameEn: 'Health English', nameFr: 'Anglais de la santé',
    descriptionFr: "Pour découvrir et pratiquer le vocabulaire médical, les échanges avec les patients et les situations de communication liées à la santé." },
  { id: 'travel', nameEn: 'Travel English', nameFr: 'Anglais du voyage',
    descriptionFr: "Pour pratiquer les conversations utiles à l'aéroport, à l'hôtel, dans les transports, au restaurant et pendant les voyages." },
  { id: 'academic', nameEn: 'Academic English', nameFr: 'Anglais académique',
    descriptionFr: "Pour les élèves, étudiants et personnes en formation : grammaire, vocabulaire académique, compréhension, présentations et communication à l'école ou à l'université." },
  { id: 'general', nameEn: 'General English', nameFr: 'Anglais général',
    descriptionFr: "Pour pratiquer les conversations du quotidien et améliorer son anglais lorsque l'on n'a pas encore choisi de spécialité." },
];
