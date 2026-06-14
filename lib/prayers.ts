export type Denomination = 'catholic' | 'protestant' | 'orthodox'

export interface Prayer {
    id: string
    title: string
    subtitle: string
    duration: number
    content: string[]
    denominations: Denomination[]
}

export interface Novena {
    id: string
    title: string
    patron: string
    days: number
    purpose: string
    dailyPrayer: string

}

export interface Reward {
    id: string
    title: string
    description: string
    icon: string
    requirement: { type: 'streak' | 'total' | 'novena'; value: number }
    color: string
}

export const PRAYERS: Prayer[] = [
    {
        id: 'morning',
        title: 'Morning Prayer',
        subtitle: 'Lauds',
        duration: 5,
        denominations: ['catholic', 'protestant', 'orthodox'],
        content: [
            'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
            'O Lord, open my lips, and my mouth shall declare Your praise.',
            'O God, come to my assistance. O Lord, make haste to help me.',
            'Glory be to the Father, and the Son, and the Holy Spirit. As it was in the beginning, is now and ever shall be, world without end. Amen.',
            'Lord, as I begin this day, I offer You all my thoughts, words, and actions. May everything I do today be done for Your glory and the good of those around me. Amen.',
        ],
    },

    {
        id: 'night',
        title: 'Night Prayer',
        subtitle: 'Compline',
        duration: 5,
        denominations: ['catholic', 'protestant', 'orthodox'],
        content: [
            'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
            'I confess to Almighty God that I have sinned in my thoughts, words, and deeds this day.',
            'Lord, I ask for Your forgiveness and peace as I rest tonight.',
            'Keep me safe through the night. Let Your angels watch over me and all those I love.',
            'Into Your hands, O Lord, I commend my spirit. Amen.',
        ],
    },

    {
        id: 'rosary',
        title: 'The Rosary',
        subtitle: 'Joyful Mysteries',
        duration: 15,
        denominations: ['catholic'],
        content: [],
    },

    {
        id: 'angelus',
        title: 'The Angelus',
        subtitle: '6 AM • 12 PM • 6 PM',
        duration: 3,
        denominations: ['catholic'],
        content:[
            'V. The Angel of the Lord declared unto Mary. R. And she conceived of the Holy Spirit.',
            'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
            'V. Behold the handmaid of the Lord. R. Be it done unto me according to thy word.',
            'Hail Mary...',
            'V. And the Word was made flesh. R. And dwelt among us.',
            'Hail Mary...',
            'Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the Incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection. Amen.',
        ],
    },
]

export const DEFAULT_SCHEDULES = [
    { name: 'Morning Prayer', time: '06:00', prayerId: 'morning', enabled: true },
    { name: 'Angelus', time: '12:00', prayerId: 'angelus', enabled: true },
    { name: 'Night Prayer', time: '21:00', prayerId: 'night', enabled: true },

]

export const NOVENAS: Novena[] = [
    {
        id: 'st-joseph',
        title: 'Novena to St. Joseph',
        patron: 'St. Joseph',
        days: 9,
        purpose: 'For workers, fathers, and families',
        dailyPrayer: 'O St. Joseph, whose protection is so great, so strong, so prompt before the throne of God, I place in you all my interests and desires. Do assist me by your powerful intercession. Amen.',
    },

    {
        id: 'divine-mercy',
        title: 'Divine Mercy Novena',
        patron: 'Jesus',
        days: 9,
        purpose: 'For sinners and the whole world',
        dailyPrayer: 'O Blood and Water, which gushed forth from the Heart of Jesus as a fount of Mercy for us, I trust in You. Jesus, I trust in You.',
    },

  {
        id: 'holy-spirit',
        title: 'Novena to the Holy Spirit',
        patron: 'Holy Spirit',
        days: 9,
        purpose: 'For guidance and wisdom',
        dailyPrayer: 'Come, Holy Spirit, fill the hearts of Your faithful and kindle in them the fire of Your love. Send forth Your Spirit and they shall be created. And You shall renew the face of the earth. Amen.',
    },

  {
        id: 'our-lady',
        title: 'Novena to Our Lady',
        patron: 'Blessed Virgin Mary',
        days: 9,
        purpose: 'For intercession and protection',
        dailyPrayer: 'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thine intercession was left unaided. Amen.',
    },
]

export const REWARDS: Reward[] = [

    { id: 'first-prayer', title: 'First Step',   description: 'Completed your first prayer',  icon: '🕊️', requirement: { type: 'total',  value: 1   }, color: '#C98A1A' },
    { id: 'streak-3',     title: 'Three Days',   description: '3-day prayer streak',          icon: '🔥', requirement: { type: 'streak', value: 3   }, color: '#C1440E' },
    { id: 'streak-7',     title: 'One Week',     description: '7-day prayer streak',          icon: '⭐', requirement: { type: 'streak', value: 7   }, color: '#C98A1A' },
    { id: 'streak-30',    title: 'A Month',      description: '30-day prayer streak',         icon: '🏆', requirement: { type: 'streak', value: 30  }, color: '#3B6D11' },
    { id: 'novena-done',  title: 'Novena Hero',  description: 'Completed a full novena',      icon: '🙏', requirement: { type: 'novena', value: 1   }, color: '#C1440E' },
    { id: 'total-50',     title: 'Faithful',     description: 'Prayed 50 times total',        icon: '✝️', requirement: { type: 'total',  value: 50  }, color: '#3B6D11' },
    { id: 'streak-100',   title: 'Centurion',    description: '100-day prayer streak',        icon: '👑', requirement: { type: 'streak', value: 100 }, color: '#C98A1A' },

]


const MYSTERIES = {
  joyful: {
    name: 'Joyful Mysteries',
    days: 'Monday & Saturday',
    mysteries: [
      'First Joyful Mystery: The Annunciation — The Angel Gabriel appears to Mary and she says yes to God.',
      'Second Joyful Mystery: The Visitation — Mary visits her cousin Elizabeth, who is filled with the Holy Spirit.',
      'Third Joyful Mystery: The Nativity — Jesus is born in a stable in Bethlehem.',
      'Fourth Joyful Mystery: The Presentation — Mary and Joseph present the infant Jesus in the Temple.',
      'Fifth Joyful Mystery: The Finding in the Temple — The young Jesus is found teaching the elders after three days.',
    ],
  },
  sorrowful: {
    name: 'Sorrowful Mysteries',
    days: 'Tuesday & Friday',
    mysteries: [
      'First Sorrowful Mystery: The Agony in the Garden — Jesus prays in Gethsemane, sweating blood in anguish.',
      'Second Sorrowful Mystery: The Scourging at the Pillar — Jesus is brutally whipped by Roman soldiers.',
      'Third Sorrowful Mystery: The Crowning with Thorns — Soldiers mock Jesus with a crown of thorns.',
      'Fourth Sorrowful Mystery: The Carrying of the Cross — Jesus carries His cross to Calvary.',
      'Fifth Sorrowful Mystery: The Crucifixion — Jesus dies on the cross for the sins of the world.',
    ],
  },
  glorious: {
    name: 'Glorious Mysteries',
    days: 'Wednesday & Sunday',
    mysteries: [
      'First Glorious Mystery: The Resurrection — Jesus rises from the dead on the third day.',
      'Second Glorious Mystery: The Ascension — Jesus ascends into Heaven forty days after His resurrection.',
      'Third Glorious Mystery: The Descent of the Holy Spirit — The Holy Spirit descends on the Apostles at Pentecost.',
      'Fourth Glorious Mystery: The Assumption — Mary is assumed body and soul into Heaven.',
      'Fifth Glorious Mystery: The Coronation — Mary is crowned Queen of Heaven and Earth.',
    ],
  },
  luminous: {
    name: 'Luminous Mysteries',
    days: 'Thursday',
    mysteries: [
      'First Luminous Mystery: The Baptism of Jesus — Jesus is baptized in the Jordan and the Father declares Him His beloved Son.',
      'Second Luminous Mystery: The Wedding at Cana — Jesus performs His first miracle at Mary\'s request.',
      'Third Luminous Mystery: The Proclamation of the Kingdom — Jesus calls all to conversion and service.',
      'Fourth Luminous Mystery: The Transfiguration — Jesus is transfigured on the mountain, revealing His divine glory.',
      'Fifth Luminous Mystery: The Institution of the Eucharist — Jesus gives us His Body and Blood at the Last Supper.',
    ],
  },
}

export function getRosaryForToday(): Prayer {
  const day = new Date().getDay() // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  const mysteryKey =
    day === 1 || day === 6 ? 'joyful'    :
    day === 2 || day === 5 ? 'sorrowful' :
    day === 0 || day === 3 ? 'glorious'  :
    'luminous' // Thursday

  const mystery = MYSTERIES[mysteryKey]

  return {
    id: 'rosary',
    title: 'The Rosary',
    subtitle: mystery.name,
    duration: 15,
    denominations: ['catholic'],
    content: [
      'Begin with the Apostles Creed: I believe in God, the Father Almighty, Creator of Heaven and earth...',
      'Our Father, who art in Heaven, hallowed be Thy name; Thy kingdom come, Thy will be done on earth as it is in Heaven...',
      'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
      'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now and ever shall be, world without end. Amen.',
      `Today we pray the ${mystery.name} — ${mystery.days}.`,
      ...mystery.mysteries,
      'Hail Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. Amen.',
    ],
  }
}