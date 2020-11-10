import React, { memo } from "react";
import LanguageSelector from "@components/LanguageSelector";

const Header = () => {
  return (
    <nav id="navbar" className="navbar navbar-theme">
        <div className="container">
            <div id="wrapper-official-navbar" className="clearfix">
                <div className="navbar-header">
                    {/* <div className="logo" /> */}
                </div>

                <div className="navbar-right">
                    <div id="wrapper-navbar-lang-switch">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default memo(Header);