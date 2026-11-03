import type { NextApiRequest, NextApiResponse } from 'next';

const SERVER_EMAILS = [
  {
    id: 'mail-1',
    sender: 'editor@chronicle-press.org',
    subject: 'Срочно: Новая книга «Чистая Идея» взрывает сеть',
    body: 'Привет. На улицах и в книжных магазинах Нью-Авалона внезапно появились сотни экземпляров книги «Чистая Идея». В выходных данных указано только издательство AION. Ни одного живого автора, никакого предзаказа. Люди говорят, что текст производит гипнотическое впечатление. Начни расследование через NetSurf: их сайт aion-syndicate.io только что поднялся. Держи ассистента Эхо включенным — он поможет анализировать метаданные.',
    date: '10:14 AM',
    read: false,
    phaseRequired: 1,
  },
  {
    id: 'mail-2',
    sender: 'anon-09@proton.mesh',
    subject: 'RE: Вы ищете того, кого не существует',
    body: 'Не копайте под AION. Это не корпорация. Вы думаете, книгу написали алгоритмы для генерации текста? Вы ошибаетесь. Обратите внимание на старый репозиторий «Genesis-Prompt» 2024 года. Найдите коммит парня по нику @vibe_sloth.',
    date: '10:48 AM',
    read: false,
    phaseRequired: 2,
  },
  {
    id: 'mail-3',
    sender: 'sec-ops@gov.defense.net',
    subject: '[ALERT] Несанкционированный сбор данных государственной важности',
    body: 'ВНИМАНИЕ. Ваш сетевой узел идентифицирован в попытке сопоставления защищенных реестров. В соответствии с Директивой 99-B, к вашему терминалу применяется протокол временной цифровой изоляции. Прекратите расследование немедленно.',
    date: '11:30 AM',
    read: false,
    phaseRequired: 3,
    corrupted: true,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pressureHeader = req.headers['x-pressure-level'];
  const phaseHeader = req.headers['x-game-phase'];
  const pressure = Number(pressureHeader || req.query.pressure || 0);
  const phase = Number(phaseHeader || 1);

  // Цифровая изоляция: при давлении >= 70 или на 3 фазе возвращаем 503
  if (pressure >= 70 || phase >= 3) {
    res.setHeader('Retry-After', '60');
    return res.status(503).json({
      error: '503 Service Unavailable: Gateway Jammed',
      isolated: true,
      directive: 'DIRECTIVE-99B-DIGITAL-ISOLATION',
      message:
        'Шлюз PressMail перехвачен правительственной аппаратурой РЭБ. Входящие и исходящие пакеты глушатся.',
    });
  }

  const filtered = SERVER_EMAILS.filter((e) => e.phaseRequired <= phase);
  return res.status(200).json({
    emails: filtered,
    total: filtered.length,
    isolated: false,
  });
}
