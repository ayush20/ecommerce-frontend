import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../../Components/Services/apiservices";
import { useNavigate } from "react-router-dom";
function Search(){
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const goToPage = (route) => {
        navigate(route);
      };
      useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (searchTerm.length >= 2) {
            fetchSearchResults();
          }
        }, 300); 
    
        return () => clearTimeout(delayDebounceFn);
      }, [searchTerm]);
    
      const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
      };
    
      const fetchSearchResults = () => {
        const dataString ={
          query:searchTerm,
      }
      ApiService.postData(
          "getsearchdata",dataString
        ).then((res) => {
          if (res.status === "success") {
            setSearchResults(res.data);
          } else {
          }
        });
      }
    return (     
        <>
        <header className="mheader">
            <div className="mheader-search">
                <input type="text" placeholder="Search for products, categories & more..." onChange={handleInputChange} autoComplete="off" value={searchTerm} />
                <div className="mheader-search-icon">
                <i className="d-icon-search"></i>
                </div>
                <div className="mheader-search-close" onClick={(e)=>goToPage('/')}>
                <i className="d-icon-times"></i>
                </div>
            </div>
        </header>
        {
          searchResults && searchResults.length>0?
          <div className="msearch-list mt-2">
          <ul>{
            searchResults.map((value, index) => (
            <a href={value.redirect}>
            <li key={index}>{value.name}
            </li>
            </a>
            ))
            }
          </ul>
          </div>
          :''
        } 
        </>
    )
}
export default Search
