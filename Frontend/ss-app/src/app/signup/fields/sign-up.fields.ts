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

export const MEMBER_FIELDS = [
  {
    key: 'username',
    type: 'username-select',
    label: 'Username'
  },
  {
    key: 'emailandpassword',
    type: 'emailandpassword-select',
    label: 'email'
  },
  {
    key: 'infoGeneral',
    type: 'infoGeneral-select',
    label: 'infoGeneral'
  }
];

export const ESCORT_FIELDS = [
  {
    key: 'escort-or-agency',
    type: 'escort-or-agency-radio',
  },
  {

  }
]

export const INDEPENDENT_ESCORT_FIELDS = [
  {
    key: 'username',
    type: 'username-select',
    label: 'Username'
  },
  {
    key: 'emailandpassword',
    type: 'emailandpassword-select',
    label: 'email'
  }
]