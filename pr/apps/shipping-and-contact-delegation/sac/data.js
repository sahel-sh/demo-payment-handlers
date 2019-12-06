// The data should be stored on the server.

const response1 = {
  methodName: 'basic-card',
  details: {
      cardNumber: '378282246310005',
      cardType: 'amex',
      cardSecurityCode: '2302',
      cardholderName: 'Jon Doe',
      expiryMonth: '09',
      expiryYear: '2029',
  },
  shippingAddress: {
      addressLine: [
          '340 Main St',
      ],
      city: 'Venice',
      country: 'US',
      dependentLocality: '',
      organization: 'Google',
      phone: '+13103106000',
      postalCode: '90291',
      recipient: 'Jon Doe',
      region: 'CA',
      sortingCode: ''
  },
  shippingOption: 'ca',
};

const response2 = {
  methodName: 'basic-card',
  details: {
      cardNumber: '4012888888881881',
      cardType: 'visa',
      cardSecurityCode: '123',
      cardholderName: 'Jon Doe',
      expiryMonth: '11',
      expiryYear: '2021',
  },
  shippingAddress: {
      addressLine: [
          '1-13 St Giles High St',
      ],
      city: 'London',
      country: 'GB',
      dependentLocality: '',
      organization: 'Google',
      phone: '+442070313000',
      postalCode: 'WC2H 8AG',
      recipient: 'Jon Doe',
      region: 'random',
      sortingCode: ''
  },
  shippingOption: 'ca',
};

const response3 = {
  methodName: 'basic-card',
  details: {
      cardNumber: '4111111111111111',
      cardType: 'visa',
      cardSecurityCode: '456',
      cardholderName: 'Jon Doe',
      expiryMonth: '07',
      expiryYear: '2022',
  },
  shippingAddress: {
      addressLine: [
          '85 10th Ave, Floor 4',
      ],
      city: 'New York',
      country: 'US',
      dependentLocality: '',
      organization: 'Google',
      phone: '+12125650000',
      postalCode: '10011',
      recipient: 'Jon Doe',
      region: 'NY',
      sortingCode: ''
  },
  shippingOption: 'us',
};
