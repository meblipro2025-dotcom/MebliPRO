export const FIELD_LABELS: Record<string, string> = {
  shape:          'Конфігурація',
  wallA:          'Стіна А',
  wallB:          'Стіна Б',
  width:          'Ширина',
  height:         'Висота',
  depth:          'Глибина',
  length:         'Довжина',
  facade:         'Тип фасаду',
  corpus:         'Матеріал корпусу',
  countertop:     'Стільниця',
  appliances:     'Вбудована техніка',
  backsplash:     'Фартух (скіналі)',
  lighting:       'Підсвітка LED',
  doors:          'Тип дверей',
  doorCount:      'К-сть дверей',
  mirror:         'Дзеркало',
  builtin:        'Вбудована (в нішу)',
  filling:        'Наповнення',
  island:         'Острів посередині',
  door:           'Двері',
  type:           'Тип меблів',
  bench:          'Лавка/пуф',
  shoebox:        'Секція для взуття',
  tvSize:         'Діагональ ТВ',
  openShelves:    'Відкриті полиці',
  age:            'Вік дитини',
  safety:         'Захисні бортики',
  desk:           'Робоче місце',
  material:       'Матеріал',
  cable:          'Кабель-менеджмент',
  what:           'Що виміряти',
  address:        "Адреса об'єкта",
  date:           'Бажана дата',
  time:           'Зручний час',
  hasDesign:      'Дизайн-проект',
  contact_method: 'Спосіб зв\'язку',
  notes:          'Примітки',
  dimensions:     'Розміри',
};

export function translateKey(key: string): string {
  return FIELD_LABELS[key] ?? key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^\w/, c => c.toUpperCase());
}

export function translateValue(val: string): string {
  if (val === 'true')  return 'Так';
  if (val === 'false') return 'Ні';
  return val;
}
