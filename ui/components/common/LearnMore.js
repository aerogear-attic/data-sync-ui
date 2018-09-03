import React from "react";

import { wrapper } from "./LearnMore.css";

const LearnMore = ({
    url = "https://docs.aerogear.org/aerogear/latest/data-sync#",
    fragment = "",
    text = "Learn More"
}) => (
    <span className={wrapper}>
        <a href={`${url}${fragment}`}>
            {text}<span className="fa fa-external-link" />
        </a>
    </span>
);

export { LearnMore };
