export const SIGN_UP_FIELDS = [
  {
    key: 'profileType',
    type: 'card-select',
    options: [
      {
        value: 'escort',
        title: 'Escort',
        description: 'I am an escort looking for clients.',
        img: '/woman.png',
        class: 'type-escort'
      },
      {
        value: 'member',
        title: 'Member',
        description: 'I am a member looking for escorts.',
        img: '/man.png',
        class: 'type-member'
      }
    ]
  },
  {

  }
];

export const CREDENTIALS_FIELDS = [
  {
    key: 'user-name',
  },
  {
    key: 'email-and-password',
  }
]

export const ESCORT_FIELDS = [
  {
    key: 'escort-or-agency',
    type: 'escort-or-agency-radio',
  },
  {

  }
]