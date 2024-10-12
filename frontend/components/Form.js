import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required')
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: []
  });
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        setIsValid(true);
      } catch (validationErrors) {
        const newErrors = {};
        validationErrors.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        setIsValid(false);
      }
    };
    validate();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => {
        const updatedToppings = checked
          ? [...prevData.toppings, value]
          : prevData.toppings.filter((topping) => topping !== value);
        return { ...prevData, toppings: updatedToppings };
      });
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      console.log(formData);
      setFormStatus('success');
      setFormData({
        fullName: '',
        size: '',
        toppings: []
      });
    } else {
      setFormStatus('failure');
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {formStatus === 'success' && (
  <div className='success'>
    Thank you for your order, {formData.fullName}!
  </div>
)}

      {formStatus === 'failure' && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name="toppings"
              type="checkbox"
              value={topping.topping_id}
              onChange={handleChange}
              checked={formData.toppings.includes(topping.topping_id)}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!isValid} />
    </form>
  )
}
