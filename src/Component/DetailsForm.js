import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ERROR_MESSAGES, FIELDS, LOCAL_STORAGE_KEY_NAME, STRING } from "../Shared/constants";

const invalidCharacter = "!@#$%^&*()_-+=~`,.<>/?;:'{}[]\\|\"\"";
const arrOfInvalidCh = invalidCharacter.split("");
const invalidCharacterForEmail = "!#$%^&*()_-+=~`,<>/?;:'{}[]\\|\"\"";
const arrOfInvalidChForEmail = invalidCharacterForEmail.split("");

const formFieldsInitialState = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  superHeroName: "",
  gender: STRING.MALE,
};

const formErrorsInitialState = {
  firstName: "",
  lastName: "",
  superHeroName: "",
  email: "",
  age: "",
  err: "",
};

export default function DetailsForm({
  id,
  show,
  data,
  setData,
  setId,
  setEvent,
  setSearchData,
  setShow,
  setListData,
}) {
  const [formFields, setFormFields] = useState(formFieldsInitialState);
  const [formErrors, setFormErrors] = useState(formErrorsInitialState);

  const resetForm = () => {
    setFormFields(formFieldsInitialState);
    setFormErrors(formErrorsInitialState);
    setShow(false);
    setSearchData("");
  };

  const validateInput = (field, value, maxLength, invalidChars, errMsg, formerr, setErrorState) => {
    let count;
    switch (field) {
      case FIELDS.FIRSTNAME:
      case FIELDS.LASTNAME:
          if (value.length > maxLength) {
            setErrorState((prevState) => ({ ...prevState, [field]: errMsg.ENTER_BELOW_LENGTH_LIMIT }));
          } else if (value.split("").some((val) => !isNaN(val) || invalidChars.some((item) => item === val))) {
          setErrorState((prevState) => ({ ...prevState, [field]: errMsg.ENTER_ALPHABETS_ONLY }));
        } else {
          setErrorState(formErrorsInitialState);
          setFormFields((prevFields) => ({ ...prevFields, [field]: value }));
        }
        break;
  
      case FIELDS.SUPER_HERO_NAME:
        count = value.split("").filter((val) => !isNaN(val));
        if (value.length > maxLength) {
          setErrorState((prevState) => ({ ...prevState, [field]: errMsg.ENTER_BELOW_LENGTH_LIMIT }));
        } else if (count.length > 5) {
          setErrorState({ [field]: ERROR_MESSAGES.NUMBER_LIMIT_EXCEED });
        } else if (value.split("").some((val) => arrOfInvalidCh.some((item) => item === val))) {
          setErrorState({ [field]: ERROR_MESSAGES.CAN_ENTER_SPECIAL_CHARACTERS });
        } else {
          setErrorState(formErrorsInitialState);
          setFormFields((prevFields) => ({ ...prevFields, [field]: value }));
        }
        break;
  
      case FIELDS.EMAIL:
        if (value.length > maxLength) {
          setErrorState((prevState) => ({ ...prevState, [field]: errMsg.ENTER_BELOW_LENGTH_LIMIT }));
        } else if (value.split("").some((val) => arrOfInvalidChForEmail.some((item) => item === val))) {
          setErrorState({ [field]: ERROR_MESSAGES.CANT_ENTER_NUMBER });
        } else if (/[A-Z]/.test(value)) {
          setErrorState({ [field]: ERROR_MESSAGES.CANT_ENTER_CAPITAL_LETTER });
        } else {
          setErrorState(formErrorsInitialState);
          setFormFields((prevFields) => ({ ...prevFields, [field]: value }));
        }
        break;
  
      case FIELDS.AGE:
        if (value.length > maxLength) {
          setErrorState((prevState) => ({ ...prevState, [field]: errMsg.ENTER_BELOW_LENGTH_LIMIT }));
        } else if (value.includes(".") || value.includes("  ") || isNaN(value)) {
          setErrorState({ [field]: ERROR_MESSAGES.ENTER_AGE_IN_RANGE });
        } else {
          setErrorState(formErrorsInitialState);
          setFormFields((prevFields) => ({ ...prevFields, [field]: value }));
        }
        break;
  
      default:
        setErrorState(formErrorsInitialState);
        setFormFields((prevFields) => ({ ...prevFields, [field]: value }));
        break;
    }
  };
  

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      age,
      email,
      superHeroName,
      gender,
    } = formFields;

    // Validation checks
    const isFirstNameValid = firstName.trim().length >= 3;
    const isLastNameValid = lastName.trim().length >= 3;
    const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    const isAllFieldsFilled =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      superHeroName.trim() !== "" &&
      age.trim() !== "" &&
      email.trim() !== "" &&
      gender.trim() !== "";

    if (!isAllFieldsFilled) {
      setFormErrors({ err: ERROR_MESSAGES.ENTER_ALL_FIELDS });
      return;
    }

    if (!isFirstNameValid || !isLastNameValid) {
      setFormErrors({
        firstName: ERROR_MESSAGES.ENTER_VALID_LENGTH,
        lastName: ERROR_MESSAGES.ENTER_VALID_LENGTH,
      });
      return;
    }

    if (!isEmailValid) {
      setFormErrors({ email: ERROR_MESSAGES.ENTER_VALID_EMAIL });
      return;
    }

    // All validations passed, proceed with saving data
    const updatedData = [
      ...data,
      {
        id: id,
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        superHeroName: superHeroName,
        gender: gender,
      },
    ];

    setListData(updatedData);
    setId((prevId) => prevId + 1);
    setData(updatedData);
    localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(updatedData));

    // Reset form fields and close the modal
    resetForm();
  };

  const handleOptionChange = (e) => {
    setFormFields((prevFields) => ({ ...prevFields, gender: e.target.value }));
  };

  return (
    <div>
      <Modal show={show} onHide={resetForm} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5 className="mx-2">{STRING.FIRSTNAME}</h5>
            <input
              type="text"
              className="form-control my-2 round rounded-4"
              placeholder="Enter FirstName"
              value={formFields.firstName}
              onChange={(e) => validateInput(FIELDS.FIRSTNAME, e.target.value, 15, arrOfInvalidCh, ERROR_MESSAGES, formErrors, setFormErrors)}
            />
            {formErrors.firstName ? <label className="text-danger">{formErrors.firstName}</label> : null}
          </div>
          <div>
            <h5 className="mx-2">{STRING.LASTNAME}</h5>
            <input
              type="text"
              className="form-control my-2 round rounded-4"
              placeholder="Enter LastName"
              value={formFields.lastName}
              onChange={(e) => validateInput(FIELDS.LASTNAME, e.target.value, 15, arrOfInvalidCh, ERROR_MESSAGES, formErrors, setFormErrors)}
            />
            {formErrors.lastName ? <label className="text-danger">{formErrors.lastName}</label> : null}
          </div>

          <div>
            <h5 className="mx-2">{STRING.SUPERHERO_NAME}</h5>
            <input
              type="text"
              className="form-control my-2 round rounded-4"
              placeholder="Enter Superhero Name"
              value={formFields.superHeroName}
              onChange={(e) => validateInput(FIELDS.SUPER_HERO_NAME, e.target.value, 15, arrOfInvalidCh, ERROR_MESSAGES, formErrors, setFormErrors)}
            />
            {formErrors.superHeroName ? <label className="text-danger">{formErrors.superHeroName}</label> : null}
          </div>
          <div>
            <h5 className="mx-2">{STRING.EMAIL}</h5>
            <input
              type="email"
              placeholder="Enter Email "
              className="form-control my-2 round rounded-4"
              value={formFields.email}
              onChange={(e) => validateInput(FIELDS.EMAIL, e.target.value, 30, arrOfInvalidChForEmail, ERROR_MESSAGES, formErrors, setFormErrors)}
            />
            {formErrors.email ? <label className="text-danger">{formErrors.email}</label> : null}
          </div>
          <div>
            <h5 className="mx-2">{STRING.GENDER}</h5>
            <div className="form-check pt-3">
              <input
                className="form-check-input"
                type="radio"
                value={STRING.MALE}
                checked={formFields.gender === STRING.MALE}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">{STRING.MALE}</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value={STRING.FEMALE}
                checked={formFields.gender === STRING.FEMALE}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">{STRING.FEMALE}</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value={STRING.OTHERS}
                checked={formFields.gender === STRING.OTHERS}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">{STRING.OTHERS}</label>
            </div>
          </div>
          <div>
            <h5 className="mx-2">{STRING.AGE}</h5>
            <input
              type="text"
              placeholder="Enter Age"
              className="form-control my-2 round rounded-4"
              value={formFields.age}
              onChange={(e) => validateInput(FIELDS.AGE, e.target.value, 2, [], ERROR_MESSAGES, formErrors, setFormErrors)}
            />
            {formErrors.age ? <label className="text-danger">{formErrors.age}</label> : null}
          </div>
          <div className="d-flex justify-content-center">
            {formErrors.err ? <h5 className="text-danger">{formErrors.err}</h5> : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>
            {STRING.CLOSE}
          </Button>
          <button className="btn btn-primary my-4" onClick={handleSubmit}>
            {STRING.SUBMIT}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
