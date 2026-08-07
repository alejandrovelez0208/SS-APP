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
    key: 'username',
    type: 'username-select',
    label: 'Username'
  },
  {
    key: 'emailandpassword',
    type: 'emailandpassword-select',
    label: 'email'
  }
];