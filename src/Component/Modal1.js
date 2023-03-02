import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
export default function Modal1({ id,show, data,setData, setId, setEvent, setSearchData,setShow ,setListData}) {

  const [cndForErr, setCndForErr] = useState(false);
  const [validFName, setValidFName] = useState(false);
  const [validLName, setValidLName] = useState(false);
  const [validSHName, setValidSHName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validAge, setValidAge] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [superHeroName, setSuperHeroName] = useState("");
  const [gender, setGender] = useState("");
  const [ageMessage, setAgeMessage] = useState("")

  const [fnameErr, setFNameErr] = useState("");
  const [lnameErr, setLNameErr] = useState("");
  const [shNameErr, setSHNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [err, setErr] = useState("");



  const handleSubmit = () => {
    if (firstName.trim() === "" || lastName.trim() === "" || superHeroName.trim() === "" || age.trim() === "" || email.trim() === "" || gender.trim() === "") {
      setCndForErr(true);
      setErr("enter all credentials are mandatory");
    }

    else if (lastName.trim().length < 3 || firstName.trim().length < 3) {
      setCndForErr(true);
      setErr("enter lastname or firstName with atleast more than 2 character");
    }
    else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
      setCndForErr(true);
      setErr("Enter valid email");
    }
    else if (firstName.trim() !== "" && lastName.trim() !== "" && age.trim() !== "" && superHeroName.trim() !== "" && email.trim() !== "" && gender.trim() !== "") {
      const dd=[...data,
        {
          id: id,
          firstName: firstName,
          lastName: lastName,
          age: age,
          email: email,
          superHeroName: superHeroName,
          gender: gender
        }]
      setListData(dd);
      setId(id => id + 1);
      setData(dd)
      localStorage.setItem("data", JSON.stringify(data));
      setFirstName("");
      setLastName("");
      setAge("");
      setEmail("");
      setGender("");
      setSuperHeroName("");
      setEvent(false);
      setShow(false);
      setCndForErr(false);
      setSearchData("");
     


    }
    setValidFName(false);
    setValidLName(false);
    setValidSHName(false);
    setValidEmail(false);
    setValidAge(false)
  };

  let invalidCharacter = "!@#$%^&*()_-+=~`,.<>/?;:'{}[]\\|\"\"";
  let arrOfInvalidCh = invalidCharacter.split("");
  function inputFirstName(e) {
    setValidAge(false)
    setValidEmail(false);
    setValidSHName(false);
    setCndForErr(false);
    setValidLName(false);
    if (e.length > 15) {
      setValidFName(true);
      setFNameErr("Enter Character less than 15");
    }
    else if (e.split("").some(val => !isNaN(val) || arrOfInvalidCh.some(item => item == val))) {
      setValidFName(true);
      setFNameErr("Enter character from A-B Only (do not Enter numeric value , special character or space bar");
    }


    else {

      setValidFName(false);
      setFirstName(e);

    }
  }

  function inputLastName(e) {
    setValidAge(false)
    setValidEmail(false);
    setValidSHName(false);
    setValidFName(false);
    setCndForErr(false);
    if (e.length > 15) {
      setValidLName(true);
      setLNameErr("Enter Character less than 15");
    }
    else if (e.split("").some(val => !isNaN(val) || arrOfInvalidCh.some(item => item == val))) {
      setValidLName(true);
      setLNameErr("Enter character from A-B Only (do not Enter numeric value , special character or space bar");
    }


    else {
      setValidLName(false);
      setLastName(e);

    }

  }

  let invalidCharacter2 = "!@%^&()-+=~`,.<>/?;:'{}[]\\|\"\"";
  let arrOfInvalidCh2 = invalidCharacter2.split("");

  function inputSuperHeroName(e) {
    setValidAge(false)
    setValidEmail(false);
    setValidLName(false);
    setValidFName(false);
    setCndForErr(false);
    let count = e.split("").filter(val => !isNaN(val));

    if (e.length > 15) {
      setValidSHName(true);
      setSHNameErr("Enter Character Less than 15");
    }
    else if (count.length > 5) {
      setValidSHName(true);
      setSHNameErr("Number limit reached or space limit exceed");
    }

    else if (e.split("").some(val => arrOfInvalidCh2.some(item => item == val))) {
      setValidSHName(true);
      setSHNameErr("Can Enter only \"_,*,$,#\"'");
    }


    else {
      setValidSHName(false);
      setSuperHeroName(e);

    }

  }
  let invalidCharacter3 = "!#$%^&*()_-+=~`,<>/?;:'{}[]\\|\"\"";
  let arrOfInvalidCh5 = invalidCharacter3.split("");

  function inputEmail(e) {
    setValidAge(false)
    setValidSHName(false);
    setValidLName(false);
    setValidFName(false);
    setCndForErr(false);
    if (e.length > 30) {
 
      setValidEmail(true);
      setEmailErr("Enter valid Email");
    }
    else if (e.split("").some(val => arrOfInvalidCh5.some(item => item == val))) {
      setValidEmail(true);
      setEmailErr("Enter character from A-B Only (do not Enter numeric value , special character or space bar");
    }
    else if (/[A-Z]/.test(e)) {
      setValidEmail(true);
      setEmailErr("Not enter capital letters ");
    }
   
    else {

      setValidEmail(false);
      setEmail(e);

    }
  }




  function ageinpt(e) {

    setValidEmail(false);
    setValidSHName(false);
    setValidLName(false);
    setValidFName(false);
    setCndForErr(false);
    if (e < 0 || e > 99||e.includes(".")||e.includes("  ") ||isNaN(e)) {

      setValidAge(true)
      setAgeMessage("Enter age between 0-100 and numeric value")
    }

    else {

      setValidAge(false)
      setAge(e)
    }
  }

  const handleOptionChange = (e) => {
    setGender(e.target.value);
  }



  return (
    <div>
      <Modal show={show} onHide={() => setShow(false)} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5 className='mx-2'>FirstName</h5>
            <input type="text" className="form-control my-2 round rounded-4" placeholder='Enter FirstName' value={firstName} onChange={(e) => inputFirstName(e.target.value)}></input>
            {validFName ? <label className="text-danger">{fnameErr}</label> : null}
          </div>
          <div>
            <h5 className='mx-2'>LastName</h5>
            <input type="text" className="form-control my-2 round rounded-4" placeholder='Enter LastName' value={lastName} onChange={(e) => inputLastName(e.target.value)}></input>
            {validLName ? <label className="text-danger">{lnameErr}</label> : null}
          </div>

          <div>
            <h5 className='mx-2'>Superhero Name</h5>
            <input type="text" className="form-control my-2 round rounded-4" placeholder='Enter Superhero Name' value={superHeroName} onChange={(e) => inputSuperHeroName(e.target.value)}></input>
            {validSHName ? <label className="text-danger">{shNameErr}</label> : null}
          </div>
          <div >
            <h5 className='mx-2'>Email</h5>
            <input type='email' placeholder='Enter Email ' className="form-control my-2 round rounded-4" value={email} onChange={(e) => inputEmail(e.target.value)} ></input>
            {validEmail ? <label className="text-danger">{emailErr}</label> : null}
          </div>
          <div >

            <h5 className='mx-2'>Gender</h5>
            <div className="form-check pt-3">
              <input
                className="form-check-input"
                type="radio"
                value="Male"
                checked={gender === "Male"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">
                Male
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value="Female"
                checked={gender === "Female"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">
                Female
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value="others"
                checked={gender === "others"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label">
                others
              </label>
            </div>

          </div>
          <div >
            <h5 className='mx-2'>Age</h5>
            <input type='text' placeholder='Enter Age' className="form-control my-2 round rounded-4" value={age} onChange={(e) => ageinpt(e.target.value)} ></input>
            {validAge ? <label className="text-danger">{ageMessage}</label> : null}
          </div>
          <div className="d-flex justify-content-center">

            {cndForErr ? <h5 className="text-danger">{err}</h5> : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShow(false)
          setCndForErr(false)
          setValidEmail(false);
    setValidSHName(false);
    setValidLName(false);
    setValidFName(false);
    setValidAge(false);
  
   
          }}>
            Close
          </Button>
          <button className='btn btn-primary my-4' onClick={handleSubmit}>Submit</button>

        </Modal.Footer>
      </Modal>

    </div>
  );
}
