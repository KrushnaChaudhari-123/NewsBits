import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const NavBar = () => {
    const [toggleLinks, setToggleLinks] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const proUser = JSON.parse(localStorage.getItem("proUser"));
        if (proUser) {
             setToggleLinks(true)
         } 
     })
    const linkClick = (path) => {
        const proUser = JSON.parse(localStorage.getItem("proUser"));
        const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
        console.log(isAdmin);
        if (!proUser) {
            navigate('../login', {replace: true})
        } else {
        if (!isAdmin) {
            navigate(`../price`, {replace: true});
        } else {
            navigate(`..${path}`, {replace: true});
        }
    }
    }
    const signOut = () => {
        localStorage.removeItem("proUser");
        setToggleLinks(false);
        navigate('../', {replace: true})
    }

    return (
        <div>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Button className="navbar-brand" onClick={() => navigate('../', {replace: true})}>NewsBits</Button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Button className="nav-link" aria-current="page" onClick={() => navigate('../', {replace: true})}>Home</Button>
                            </li>
                         <li className="nav-item"><Button className="nav-link" onClick={() => linkClick('/business')} >Business</Button></li>
                            <li className="nav-item"><Button className="nav-link" onClick={() => linkClick('/entertainment')} >Entertainment</Button></li>
                            <li className="nav-item"><Button className="nav-link"  onClick={() => linkClick('/general')}>General</Button></li>
                            <li className="nav-item"><Button className="nav-link"  onClick={() => linkClick('/health')}>Health</Button></li>
                            <li className="nav-item"><Button className="nav-link" onClick={() => linkClick('/science')}>Science</Button></li>
                            <li className="nav-item"><Button className="nav-link"  onClick={() => linkClick('/sports')}>Sports</Button></li>
                            <li className="nav-item"><Button className="nav-link"  onClick={() => linkClick('/technology')}>Technology</Button></li>
                            <li className="nav-item"><Button className="nav-link"  onClick={() => linkClick('/favourites')}>Favourites</Button></li>
                          </ul>
                        {!toggleLinks && <> <Button className="nav-link" aria-current="page" onClick={() => navigate('../signup', {replace: true})}>Signup</Button>
                        <Button className="nav-link" aria-current="page" onClick={() => navigate('../login', {replace: true})}>Login</Button></>}
                        {toggleLinks && <Button className="nav-link" aria-current="page" onClick={signOut}>Logout</Button>}
                    </div>
                </div>
            </nav>
        </div>
    )

}

export default NavBar
//to="/business"