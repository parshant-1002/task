import React from "react";

export default function Table({ listData, setListData, inputData, setInputData }) {
  const ASC = "asc";
  const DEC = "dec";

  const handleSort = (heading, type) => {
    const list = [...listData]; // Create a new copy of listData
    list.sort((a, b) => {
      const comparison = (a[heading.value] > b[heading.value]) ? 1 : -1;
      if (a[heading.value] == b[heading.value]) comparison = 0;
      return (type === ASC) ? comparison : -comparison;
    });
    setListData(list);
  };

  const HeadingArray = {
    FIRST_NAME: {
      title: "FirstName",
      value: "firstName"
    },
    LAST_NAME: {
      title: "LastName",
      value: "lastName"
    },
    SUPER_HERO_NAME: {
      title: "Superhero Name",
      value: "superHeroName"
    },
    EMAIL: {
      title: "Email",
      value: "email"
    },
    GENDER: {
      title: "Gender",
      value: "gender"
    },
    AGE: {
      title: "Age",
      value: "age"
    },
  };

  return (
    <div className="d-flex justify-content-center w-100">
      <table className="table  table-warning ">
        <thead className='table table-success'>
          <tr>
            <th className='p-3'>#</th>
            {Object.values(HeadingArray).map((heading) => {
              return (
                <th >
                  <div className='d-flex '>
                    {heading.title}
                    <div >
                      <button
                        className='fa fa-caret-up btn btn-sm'
                        onClick={() => { handleSort(heading, ASC) }}
                      ></button>
                      <button
                        className='fa fa-caret-down btn btn-sm'
                        onClick={() => { handleSort(heading, DEC) }}
                      ></button>
                    </div>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>

          {listData.map((val) => {
            const handleCheckboxChange = (e) => {
              const { checked } = e.target;
              const updatedData = checked
                ? [...inputData, val.id]
                : inputData.filter(item => item !== val.id);
              setInputData(updatedData);
            };

            return (
              <tr key={val.id}>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={inputData.includes(val.id)}
                    onChange={handleCheckboxChange}
                  />
                </td>
                <td>{val.firstName}</td>
                <td>{val.lastName}</td>
                <td>{val.superHeroName}</td>
                <td>{val.email}</td>
                <td>{val.gender}</td>
                <td>{val.age}</td>
              </tr>
            );
          })}


        </tbody>
      </table>
    </div>
  );
}
