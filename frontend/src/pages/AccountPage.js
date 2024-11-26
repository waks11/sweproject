import { SideBar } from "./components/side_bar/SideBar";
import { AccountInfo } from "./components/account_page/AccountInfo";

export const AccountPage = () => {
    return(
        <div className="flex">
            <SideBar />
            <div className="ml-16 p-6 w-full">
                <AccountInfo />
            </div>
        </div>
    );
};

export default AccountPage;