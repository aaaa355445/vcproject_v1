// Contact.js
import React, { useState, useRef } from "react";
import { submitContactForm } from "../../Services/Api";
import "./Contact.css";
import Faq from "../../components/Faq/Faq";

const Contact = () => {
  const [message, setMessage] = useState("");
  const initialFormData = {
    name: "",
    email: "",
    checklist: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const checklistQueries = [
    { checklistQuery: "Want to report an issue" },
    { checklistQuery: "Want to suggest a feature" },
    { checklistQuery: "Want to suggest specific reports" },
    { checklistQuery: "Others" },
  ];

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitContactForm(formData);
        setMessage(response.message);
        setFormData(initialFormData);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <>
      <div className="contact-section">
        <h1>Contact <span>us</span></h1>
        <h3>
          Please feel free to suggest reports, any features, and issues here!
        </h3>
        {message && (
          <div className="snackbar">
            <p className="message">{message}</p>
            <span className="close-button" onClick={handleClose}>
              &times;
            </span>
          </div>
        )}
        <div className="contact-form">
          <form onSubmit={handleSubmit} className="form">
            <div className="input">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ayush Mittal"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ayush.m@redseerconsulting.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input">
              <label className="checklist">What would you like to do?*</label>
              {checklistQueries.map((item, index) => (
                <div key={index} className="radio">
                  <input
                    type="radio"
                    id={`radio-${index}`}
                    name="checklist"
                    value={item.checklistQuery}
                    onChange={handleChange}
                    required
                  />
                  <label className="checklistlabel" htmlFor={`radio-${index}`}>
                    {" "}
                    {item.checklistQuery}
                  </label>
                </div>
              ))}
            </div>

            <div className="input">
              <label htmlFor="description">
                Tell us about your experience here*
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell us about it"
                rows="10"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="input">
              <label htmlFor="upload">Want to upload something?</label>
              <input
                type="file"
                id="upload"
                name="upload"
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button style={{marginTop: "8px"}} type="button" onClick={handleUploadClick} className="upload-button">
                Upload Files
              </button>
            </div> */}

            <div className="submitBtn">
              <button type="submit" className="submit-button">
                Wake up guys
              </button>
              <span>Click the button to submit</span>
            </div>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <Faq />
      </div>
    </>
  );
};

export default Contact;
