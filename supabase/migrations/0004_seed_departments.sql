insert into challenge_departments (id, name_en, name_fr, description_fr, whatsapp_invite_url, is_open)
values
('tech','Tech English','Anglais de la technologie',
 'Pour les personnes intéressées par l''informatique, le développement logiciel, l''intelligence artificielle, les outils numériques et la communication technique.',
 'https://chat.whatsapp.com/Lcppbvzekf0IuCvhU1lqDH', true),
('business','Business English','Anglais des affaires',
 'Pour apprendre les expressions commerciales, la vente, la négociation, les réunions, l''entrepreneuriat et la communication professionnelle.',
 'https://chat.whatsapp.com/GfzizXFnbGtF8S1k1tMV9n?s=cl&p=a&mlu=4&ilr=4', true),
('health','Health English','Anglais de la santé',
 'Pour découvrir et pratiquer le vocabulaire médical, les échanges avec les patients et les situations de communication liées à la santé.',
 'https://chat.whatsapp.com/HUU2Xb6nDWd3MjfYnlUGOy', true),
('travel','Travel English','Anglais du voyage',
 'Pour pratiquer les conversations utiles à l''aéroport, à l''hôtel, dans les transports, au restaurant et pendant les voyages.',
 'https://chat.whatsapp.com/BnQy9bPJFeI1hSwAU0VBrC', true),
('academic','Academic English','Anglais académique',
 'Pour les élèves, étudiants et personnes en formation : grammaire, vocabulaire académique, compréhension, présentations et communication à l''école ou à l''université.',
 'https://chat.whatsapp.com/GYzVz2FZOVe50BsuMnbme8', true),
('general','General English','Anglais général',
 'Pour pratiquer les conversations du quotidien et améliorer son anglais lorsque l''on n''a pas encore choisi de spécialité.',
 null, false)
on conflict (id) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  description_fr = excluded.description_fr;
