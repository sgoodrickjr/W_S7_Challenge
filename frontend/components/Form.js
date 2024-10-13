import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: "Full name must be at least 3 characters",
  fullNameTooLong: "Full name must be at most 20 characters",
  fullNameRequired: "Full name is required",
  sizeIncorrect: "Size must be S, M, or L",
  sizeRequired: "Size is required",
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(validationErrors.fullNameRequired),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required(validationErrors.sizeRequired),
});

// Toppings array
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

const sizeMapping = {
  S: 'small',
  M: 'medium',
  L: 'large',
};

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });
  const [submittedData, setSubmittedData] = useState(null);
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
      setFormData((prevData) => ({
        ...prevData,
        toppings: checked
          ? [...prevData.toppings, value]
          : prevData.toppings.filter((topping) => topping !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      // Synchronous validation for size field to ensure immediate error message
      if (name === 'size') {
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            size: validationErrors.sizeRequired,
          }));
        } else if (!['S', 'M', 'L'].includes(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            size: validationErrors.sizeIncorrect,
          }));
        } else {
          setErrors((prevErrors) => {
            const {...restErrors } = prevErrors; // Remove the size property from errors
            return restErrors;
          });
          
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        const response = await fetch('http://localhost:9009/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        console.log(result);

        const selectedToppings = formData.toppings.map((toppingId) =>
          toppings.find((topping) => topping.topping_id === toppingId).text
        );

        setFormStatus('success');
        setSubmittedData({
          fullName: formData.fullName,
          size: formData.size,
          toppings: selectedToppings,
        });

        setFormData({
          fullName: '',
          size: '',
          toppings: [],
        });
      } catch (error) {
        setFormStatus('failure');
        console.error('Error submitting the form:', error);
      }
    } else {
      setFormStatus('failure');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>

      {formStatus === "success" && submittedData && (
        <div className="success">
          Thank you for your order, {submittedData.fullName}! Your{" "}
          {sizeMapping[submittedData.size]} pizza{" "}
          {submittedData.toppings.length === 0
            ? " with no toppings "
            : ` with ${submittedData.toppings.length} ${
                submittedData.toppings.length > 1 ? "toppings " : "topping "
              }`}
          is on the way.
        </div>
      )}

      {formStatus === "failure" && (
        <div className="failure">Something went wrong</div>
      )}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
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
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name="toppings"
              type="checkbox"
              value={topping.topping_id}
              onChange={handleChange}
              checked={formData.toppings.includes(topping.topping_id)}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>

      {/* 👇 Submit button disabled if the form is invalid */}
      <input type="submit" disabled={!isValid} />
    </form>
  );
}
