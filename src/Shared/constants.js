export const STRING = {
    SURE_TO_DELETE: "Sure to delete items",
    DELETE: "Delete",
    SELECT_TO_DELETE: "Select to Delete",
    ADD_RECORD: "Add Record",
    MALE: "Male",
    FEMALE: "Female",
    OTHERS: "Others",
    FIRSTNAME: "FirstName",
    LASTNAME: "LastName",
    SUPERHERO_NAME: "Superhero Name",
    EMAIL: "Email",
    GENDER: "Gender",
    CLOSE: "Close",
    SUBMIT: "Submit",
    AGE: "Age",
}

export const ERROR_MESSAGES = {
    ENTER_ALL_FIELDS: "enter all fields are mandatory",
    ENTER_VALID_LENGTH: "enter lastname or firstName with atleast more than 2 character",
    ENTER_VALID_EMAIL: "Enter valid email",
    ENTER_BELOW_LENGTH_LIMIT: (length)=>(`Enter Character less than ${length+1} only`),
    ENTER_ALPHABETS_ONLY: "Enter alphabets only (do not Enter numeric value , special character or space bar",
    NUMBER_LIMIT_EXCEED: "Number limit reached or space limit exceed",
    CAN_ENTER_SPECIAL_CHARACTERS: "Can Enter only \"_,*,$,#\"'",
    CANT_ENTER_NUMBER: "Enter alphabets only (do not Enter numeric value or space bar",
    CANT_ENTER_CAPITAL_LETTER: "Not enter capital letters ",
    ENTER_AGE_IN_RANGE: "Enter age between 0-100 and numeric value",
}
export const LOCAL_STORAGE_KEY_NAME = "data";

export const FIELDS = {
    FIRSTNAME : "firstName",
    LASTNAME: "lastName",
    SUPER_HERO_NAME: "superHeroName",
    EMAIL :"email",
    AGE: "age",
}