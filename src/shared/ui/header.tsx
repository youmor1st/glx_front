import {
  parseInitDataQuery,
  retrieveRawInitData,
} from "@telegram-apps/sdk-react";
import { Avatar } from "@telegram-apps/telegram-ui";

function Header() {
  const initDataQuery = retrieveRawInitData();
  const initData = parseInitDataQuery(initDataQuery!);

  return (
    <div className="h-[40px] z-50 flex justify-between items-center shadow-mds  border-secondary-background/13">
      <div className="flex gap-3 items-center">
        <Avatar
          className="w-[40px] h-[40px]"
          src={initData ? initData.user?.photo_url : ""}
        ></Avatar>
        <p className="text-light-100 text-base font-medium">
          {initData.user?.username ? "@" + initData.user?.username : "Username"}
        </p>
      </div>
    </div>
  );
}

export default Header;
