import React from "react";
import { useActionConfigs } from "../use-actions";

function ActionBar() {
  const actions = useActionConfigs();

  return (
    <div className=" z-50 flex justify-between items-center shadow-mds  border-secondary-background/13 h-[72px]">
      {actions.map((action, index) => (
        <React.Fragment key={"action_" + index}>
          {action}
          {index === 1 && (
            <div className="w-px h-full bg-primary-100/16 sm:hidden" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ActionBar;
