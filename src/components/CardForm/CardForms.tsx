import React, { useEffect } from "react";
import "./Button.scss";


const CardForm = ({option} : {option: 'string'}) => {
  console.log('option', option)
  useEffect(() => {
    const script = document.createElement("script");

      script.src = "https://beta-sdk.mercadopago.com/js/v2";
      script.async = true;

      document.body.appendChild(script);

      let MercadoPago: any

      const mp = new MercadoPago("TEST-2bf9f710-6a6e-47c8-a207-79f5e73b464c");
      const cardForm = mp.cardForm({
        amount: "100.5",
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número do cartão",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de segurança",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular do cartão",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emissor",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Parcelas",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "Número do documento",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
        },
        callbacks: {
          onFormMounted: (error: any) => {
            if (error) return console.warn("Form Mounted handling error: ", error);
            console.log("Form mounted");
          },
          onSubmit: (event: { preventDefault: () => void; }) => {
            event.preventDefault();

            const {
              paymentMethodId: payment_method_id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType,
            } = cardForm.getCardFormData();

            fetch("http://localhost:8082/process_payment_card_form", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token,
                issuer_id,
                payment_method_id,
                transaction_amount: Number(amount),
                installments: Number(installments),
                description: "Descrição do produto",
                payer: {
                  email,
                  identification: {
                    type: identificationType,
                    number: identificationNumber,
                  },
                },
              }),
            })
              .then(response => response.json())
              .then(result => alert(JSON.stringify(result, null, 2)))
              .catch(alert);
          },
          onFetching: (resource: any) => {
            console.log("Fetching resource: ", resource);

            // Animate progress bar
            const progressBar = document.querySelector(".progress-bar");
            progressBar?.removeAttribute("value");

            return () => {
              progressBar?.setAttribute("value", "0");
            };
          },
          onReady: () => {
            console.log("Card Form ready");
          },
          onValidityChange: (error: any, field: any) => {
            console.log(field, error);
          },
          onError: (error: any) => {
            console.log(error);
          },
          onIdentificationTypesReceived: (error: any, data: any) => console.log("onIdentificationTypesReceived", error, data),
          onPaymentMethodsReceived: (error: any, data: any) => console.log("onPaymentMethodsReceived", error, data),
          onIssuersReceived: (error: any, data: any) => console.log("onIssuersReceived", error, data),
          onInstallmentsReceived: (error: any, data: any) => console.log("onInstallmentsReceived", error, data),
          onCardTokenReceived: (error: any, data: any) => console.log("onCardTokenReceived", error, data)
        },
      });
    }, [])

    return (
      <form id="form-checkout">
      <input id="form-checkout__cardNumber" />
      <input id="form-checkout__expirationDate" />
      <input id="form-checkout__securityCode" />
      <input type="text" id="form-checkout__cardholderName" />
      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>
      <select id="form-checkout__identificationType"></select>
      <input type="text" id="form-checkout__identificationNumber" />
      <input type="email" id="form-checkout__cardholderEmail" />
      <button type="submit" id="form-checkout__submit">Pagar</button>
      <progress value="0" className="progress-bar">Carregando...</progress>
  </form>
  );
};

export default CardForm;
