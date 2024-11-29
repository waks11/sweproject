import { SideBar } from "./components/side_bar/SideBar";
import { AccountInfo } from "./components/account_page/AccountInfo";
import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "./components/UserContext";

export const AccountPage = () => {

    const { user } = useContext(UserContext);

    return(
        <div className="flex">
            <SideBar />
            <div className="ml-16 p-6 w-full">
                <AccountInfo userInfo={user}/>
            </div>
        </div>
    );
};

export default AccountPage;