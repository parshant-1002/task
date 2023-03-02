import React,{useState} from "react";

export default function Table({listData,setListData,inputData,setInputData}) {
  const [cndFN, setCndFN] = useState(true);
  const [cndLN, setCndLN] = useState(true);
  const [cndSN, setCndSN] = useState(true);
  const [cndAg, setCndAg] = useState(true);
  const [cndEm, setCndEm] = useState(true);
  const [cndGd, setCndGd] = useState(true);



  const sortList=(list)=>{!cndFN? setListData(list): setCndFN(false);};
  const sortListLN=(list)=>{!cndLN? setListData(list):  setCndLN(false);};
  const sortListSN=(list)=>{!cndSN?setListData(list):setCndSN(false);};
  const sortListAg=(list)=>{!cndAg? setListData(list):setCndAg(false);};
  const sortListEm=(list)=>{!cndEm?setListData(list):setCndEm(false);};
  const sortListGd=(list)=>{!cndGd? setListData(list): setCndGd(false);};




  return (
    <div className="d-flex justify-content-center w-100">
      <table className="table  table-warning ">
        <thead className='table table-success'>

          <tr>
            <th className='p-3'>#</th>
            <th >
                  
              <div className='d-flex '>
                    FirstName
                <div >
                  <button className='fa fa-caret-up btn btn-sm' onClick={()=>{
                    const list=listData;
                   
                    list.sort((a,b)=>{
                      if(a.firstName>b.firstName){
                        return 1;
                      }
                      else{
                        return -1;
                      }
                    });
                    setCndFN(true);
                    sortList(list);
                  }}
                  >

                  </button>
                  <button className='fa fa-caret-down btn btn-sm'  onClick={()=>{
                    const list=listData;
                    list.sort((a,b)=>{
                      if(a.firstName<b.firstName){
                        return 1;
                      }
                      else{
                        return -1;
                      }
                    });
                      
                    setCndFN(true);
                    sortList(list);
                        
                      
                    
                  }}></button>
                </div>
              </div>
            </th>
            <th>
              <div className='d-flex '>
                    LastName
                <div >
                  <button className='fa fa-caret-up btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.lastName>b.lastName){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndLN(true);
                      sortListLN(list);
                      
                    
                    }}></button>
                  <button className='fa fa-caret-down btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.lastName<b.lastName){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndLN(true);
                      sortListLN(list);
                    }}></button>
                </div>
              </div>
            </th>
            <th>
              <div className='d-flex '>
                    Superhero Name
                <div >
                  <button className='fa fa-caret-up btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.superHeroName>b.superHeroName){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndSN(true);
                      sortListSN(list);
                    
                    }}></button>
                  <button className='fa fa-caret-down btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.superHeroName<b.superHeroName){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndSN(true);
                      sortListSN(list);
                    
                    
                    }}></button>
                </div>
              </div>
            </th>
            <th>
              <div className='d-flex '>
                    Email
                <div >
                  <button className='fa fa-caret-up btn btn-sm' onClick={()=>{
                    const list=listData;
                
                    list.sort((a,b)=>{
                      if(a.email>b.email){
                        return 1;
                      }
                      else{
                        return -1;
                      }
                    });
                 
                    setCndEm(true);
                   
                    sortListEm(list);
                    
                  }}></button>
                  <button className='fa fa-caret-down btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.email<b.email){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                     
                      setCndEm(true);
                      sortListEm(list);
                    
                    
                    }}></button>
                </div>
              </div>

            </th>
            <th>
              <div className='d-flex '>
                    Gender
                <div >
                  <button className='fa fa-caret-up btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.gender>b.gender){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndGd(true);
                     
                      sortListGd(list);
                    
                    }}></button>
                  <button className='fa fa-caret-down btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.gender<b.gender){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndGd(true);
                      sortListGd(list);
                    
                    
                    
                    }}></button>
                </div>
              </div>
            </th>
            <th>
              <div className='d-flex '>
                    Age
                <div >
                  <button className='fa fa-caret-up btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.age>b.age){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndAg(true);

                      sortListAg(list);
                    
                    }}></button>
                  <button className='fa fa-caret-down btn btn-sm'
                    onClick={()=>{
                      const list=listData;
                      list.sort((a,b)=>{
                        if(a.age<b.age){
                          return 1;
                        }
                        else{
                          return -1;
                        }
                      });
                      setCndAg(true);
            
                      sortListAg(list);
                    
                    
                    }}></button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>

          {listData.map((val) => {
            return (
              <tr>
                <td>
                  <input type="checkbox" className='form-check-input' checked={inputData.includes(val.id)} onChange={(e) => {
                    if (e.target.checked) {
                      setInputData([...inputData, val.id]);
                    }
                    else {
                      setInputData(inputData.filter(item => item !== val.id));
                    }
                  }} />
                </td>

                <td>{val.firstName}</td>
                <td>{val.lastName}</td>
                <td>{val.superHeroName}</td>
                <td>{val.email}</td>
                <td>{val.gender}</td>
                <td>{val.age}</td>
              </tr>
            );
          }) }

        </tbody>
      </table>
    </div>
  );
}
