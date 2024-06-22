import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAxiosSecure from '../components/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ booking, discountApplied }) => {
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const adjustedPrice = discountApplied ? booking.price * 0.9 : booking.price;
    if (adjustedPrice > 0) {
      axiosSecure.post('/create-payment-intent', { price: adjustedPrice })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, booking.price, discountApplied]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('');
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: booking.email || 'anonymous',
          name: booking.name || 'anonymous',
        },
      },
    });

    if (confirmError) {
      console.log('confirm error', confirmError);
    } else {
      if (paymentIntent.status === 'succeeded') {
        setTransactionId(paymentIntent.id);

        const payment = {
          email: booking.email,
          price: discountApplied ? booking.price * 0.9 : booking.price,
          transactionId: paymentIntent.id,
          date: new Date(),
          bookingId: booking._id,
        };

        const res = await axiosSecure.post('/payments', payment);
        if (res.data?.paymentResult?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Payment successful!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/my-bookings');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button className="btn btn-sm btn-primary my-4" type="submit" disabled={!stripe || !clientSecret}>
        Pay
      </button>
      <p className="text-red-600">{error}</p>
      {transactionId && <p className="text-green-600">Your transaction id: {transactionId}</p>}
    </form>
  );
};

export default CheckoutForm;
