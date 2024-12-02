import { SideBar } from "./components/side_bar/SideBar";
import { AccountInfo } from "./components/account_page/AccountInfo";
import { AdminInfo } from "./components/account_page/AdminInfo";
import { useState, useContext } from "react";
import { UserContext } from "./components/UserContext";

export const AccountPage = () => {

    const { user, loading } = useContext(UserContext);

    if(loading) return <div>Loading...</div>; 

    console.log(user);
        
    return(
        <div className="flex">
            <SideBar />
            <div className="ml-16 p-6 w-full">
                {!user.admin ? (<AccountInfo userInfo={user}/>) : (<AdminInfo />)}
            </div>
        </div>
    );
};

export default AccountPage;