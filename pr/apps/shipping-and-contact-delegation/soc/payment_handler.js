self.importScripts('data.js');

// TODO: Keep state in the window instead, because a single service worker
// can talk to multiple windows.

self.paymentRequestEvent = null;
self.resolver = null;
self.response = response1;
self.messageDestination = null;

function sendMessage(msg) {
  if (self.messageDestination) {
    console.log('Sending message to payment handler window: ' + JSON.stringify(msg, undefined, 2));
    self.messageDestination.postMessage(msg);
  } else {
    console.log('No destination found for message: ' + JSON.stringify(msg, undefined, 2));
  }
}

function notifyShippingOptionChanged() {
  self.paymentRequestEvent.changeShippingOption(self.response.shippingOption).then((shippingOptionChangeResponse) => {
    sendMessage(shippingOptionChangeResponse);
  }).catch((error) => {
    sendMessage({error: error.message});
  });
}

self.addEventListener('message', (evt) => {
  if (evt.data === 'confirm') {
    if (self.resolver !== null) {
      self.resolver(response);
      self.resolver = null;
    } else {
      sendMessage({error: 'Service worker cannot confirm payment because there is no resolver function.'});
    }
  } else if (evt.data === 'change-option-1') {
    self.response = response1;
    if (self.paymentRequestEvent !== null && self.paymentRequestEvent.changeShippingOption) {
      notifyShippingOptionChanged();
    } else {
      sendMessage({error: 'Service worker cannot change payment method. There is no payment request event or no change shipping option feature.'});
    }
  } else if (evt.data === 'change-option-2') {
    self.response = response2;
    if (self.paymentRequestEvent !== null && self.paymentRequestEvent.changeShippingOption) {
      notifyShippingOptionChanged();
    } else {
      sendMessage({error: 'Service worker cannot change shipping option. There is no payment request event or no change shipping option feature.'});
    }
  } else if (evt.data === 'change-option-3') {
    self.response = response3;
    if (self.paymentRequestEvent !== null && self.paymentRequestEvent.changeShippingOption) {
      notifyShippingOptionChanged();
    } else {
      sendMessage({error: 'Service worker cannot change shipping option. There is no payment request event or no change shipping option feature.'});
    }
  }else {
    sendMessage({error: 'Service worker did not recognize the message "' + evt.data + '".'});
  }
});

self.addEventListener('paymentrequest', (evt) => {
  if (evt.delegateToWindow) {
    evt.delegateToWindow('payment_handler_window.html');
    return;
  }

  self.paymentRequestEvent = evt;
  self.paymentRequestEvent.respondWith(new Promise((resolve) => {
    self.resolver = resolve;
    evt.openWindow('payment_handler_window.html').then((windowClient) => {
      self.messageDestination = windowClient;
    }).catch((error) => {
      console.log(error.message);
    });
  }));
});
