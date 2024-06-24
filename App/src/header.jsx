import { useState } from 'react'
import './header.css'
import viteLogo from '/vite.svg'

function Header() {

    return(
    <main>
        <div className = "Heading">
        
            <img className = "logo" src = {viteLogo}  alt = "Fetch Banking Logo" />
            <div className = "BankName">F E T C H <div className='BankName2'>BANKING COMPANY</div> </div>
            <div className = "Header_Buttons">
                <button onClick={() => alert("PROFILE")}className = "Profile">Profile</button>
                <button className = "Logout">Logout</button>
            </div>
        
        </div>
        <nav className="nav">
                <a href="#">My Accounts</a>
                <a href="#">Transfer</a>
                <a href="#">Pay</a>
                <a href="#">Cards</a>
                <a href="#">Apply</a>
                <a href="#">Loyalty Points<sup>NEW!</sup></a>
        </nav>
    
       




    </main>
    )


}
    




export default Header