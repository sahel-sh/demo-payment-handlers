let response = response1;

const msg = document.getElementById('msg');
function output(message) {
  msg.innerHTML = message;
  console.log(message);
}

const currency = document.getElementById('currency');
const value = document.getElementById('value');
const button = document.getElementById('confirm');
button.disabled = true;
function updateAmount(currencyUpdate, valueUpdate) {
  currency.innerHTML = currencyUpdate;
  value.innerHTML = valueUpdate;
  if (currencyUpdate === 'N/A')
    button.disabled = true;
  else
    button.disabled = false;
}

const pleasewait = document.getElementById('pleasewait');
let paymentRequestEvent = null;
function init() {
  pleasewait.style.display = 'block';
  navigator.serviceWorker.getRegistration('payment_handler.js').then((registration) => {
    if (!registration) {
      output('Service worker not installed.');
      pleasewait.style.display = 'none';
    } else if (!registration.paymentManager) {
      output('Payment manager not found.');
      pleasewait.style.display = 'none';
    } else if (!registration.paymentManager.paymentRequestEvent) {
      output('Payment request event is not implemented yet.');
      pleasewait.style.display = 'none';
    } else {
      registration.paymentManager.paymentRequestEvent.then((evt) => {
        if (evt) {
          output('Received the payment request event.');
          paymentRequestEvent = evt;
          console.log(evt.paymentOptions.shippingType);
        } else {
          output('Failed to retrieve the payment request event.');
        }
        pleasewait.style.display = 'none';
      }).catch((error) => {
        output(error);
        pleasewait.style.display = 'none';
      });
    }
    pleasewait.style.display = 'none';
  }).catch((error) => {
    output(error);
    pleasewait.style.display = 'none';
  });
}
init();

button.addEventListener('click', (evt) => {
  if (paymentRequestEvent) {
    button.style.display = 'none';
    pleasewait.style.display = 'block';
    try {
      paymentRequestEvent.respondWith(response);
    } catch (error) {
      output(error);
      button.style.display = 'block';
      pleasewait.style.display = 'none';
    }
  } else if (navigator.serviceWorker.controller) {
    button.style.display = 'none';
    pleasewait.style.display = 'block';
    navigator.serviceWorker.controller.postMessage('confirm');
  } else {
    output('Neither payment request event nor service worker controller found');
  }
});

function changeShippingAddress(which_one) {
  msg.innerHTML ='';
  let message = '';
  updateAmount('N/A','N/A');
  if (which_one === 1) {
    response = response1;
    message = 'address-1';
  } else if (which_one === 2) {
    response = response2;
    message = 'address-2';
  } else if (which_one === 3) {
    response = response3;
    message = 'address-3';
  } else {
    output('Unknown address identifier ' + which_one.toString());
    return;
  }

  if (paymentRequestEvent) {
    output('shipping type:\t' + paymentRequestEvent.paymentOptions.shippingType);
    if (!paymentRequestEvent.changeShippingAddress) {
      output('No shipping address change feature in the payment request event.');
      return;
    }
    pleasewait.style.display = 'block';
    paymentRequestEvent.changeShippingAddress(response.shippingAddress).then((paymentHandlerUpdate) => {
      pleasewait.style.display = 'none';
      if (!paymentHandlerUpdate) {
        return;
      }
      if (paymentHandlerUpdate.error) {
        output(error);
        updateAmount('N/A','N/A');
      }
      pleasewait.style.display = 'none';
    }).catch((error) => {
      output(error);
      updateAmount('N/A','N/A');
      pleasewait.style.display = 'none';
    });
  } else if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    output('Neither payment request event nor service worker controller found');
  }
}

const shippingAddress1 = document.getElementById('shipping-address-1');
shippingAddress1.addEventListener('click', (evt) => {
  changeShippingAddress(1);
});

const shippingAddress2 = document.getElementById('shipping-address-2');
shippingAddress2.addEventListener('click', (evt) => {
  changeShippingAddress(2);
});

const shippingAddress3 = document.getElementById('shipping-address-3');
shippingAddress3.addEventListener('click', (evt) => {
  changeShippingAddress(3);
});

navigator.serviceWorker.addEventListener('message', (evt) => {
  if (!evt.data) {
    output('Received an empty message');
    return;
  }

  if (evt.data.error) {
    output(evt.data.error);
    return;
  }
  
  if (evt.data.total) {
    updateAmount(evt.data.total.currency, evt.data.total.value);
  }
});
