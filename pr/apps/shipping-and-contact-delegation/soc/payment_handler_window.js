let response = response1;

const msg = document.getElementById('msg');
function output(message) {
  msg.innerHTML = message;
  console.log(message);
}

const currency = document.getElementById('currency');
const value = document.getElementById('value');
const button = document.getElementById('confirm');
function updateAmount(currencyUpdate, valueUpdate) {
  currency.innerHTML = currencyUpdate;
  value.innerHTML = valueUpdate;
  if (currencyUpdate==='N/A')
    button.disabled = true;
  else
    button.disabled = false;
}

const pleasewait = document.getElementById('pleasewait');
const shippingOption1 = document.getElementById('shipping-option-1');
const shippingOption2 = document.getElementById('shipping-option-2');
const shippingOption3 = document.getElementById('shipping-option-3');
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
          if (!evt.shippingOptions || evt.shippingOptions.length !=2) {
            output('Unable to process shipping options in the payment request');
          } else {
            shippingOption1.innerHTML = evt.shippingOptions[0].id;
            shippingOption2.innerHTML = evt.shippingOptions[1].id;
            shippingOption3.innerHTML = 'invalid';
            output('Processed the shipping options in the payment request');
          }
          
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

function changeShippingOption(which_one) {
  let message = '';
  msg.innerHTML = '';
  updateAmount('N/A','N/A');
  if (which_one === 1) {
    response = response1;
    message = 'change-option-1';
  } else if (which_one === 2) {
    response = response2;
    message = 'change-option-2';
  } else if (which_one === 3) {
    response = response3;
    message = 'change-option-3';
  }  else {
    output('Unknown shipping option identifier ' + which_one.toString());
    return;
  }

  if (paymentRequestEvent) {
    if (!paymentRequestEvent.changeShippingOption) {
      output('No shipping option change feature in the payment request event.');
      return;
    }
    pleasewait.style.display = 'block';
    paymentRequestEvent.changeShippingOption(response.methodName, redact(response)).then((paymentHandlerUpdate) => {
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

shippingOption1.addEventListener('click', (evt) => {
  changeShippingOption(1);
});

shippingOption2.addEventListener('click', (evt) => {
  changeShippingOption(2);
});

shippingOption3.addEventListener('click', (evt) => {
  changeShippingOption(3);
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
