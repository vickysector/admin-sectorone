import clsx from "clsx";
import { useEffect, useState } from "react";

export const FormattedParagraph = ({ response }) => {
  const [responseText, setResponseText] = useState("");

  function cleanResponseText(responseText) {
    // Define a regex pattern to match the masked sections
    // const pattern = /(\*+@gmail\.\*+|\*{5,})/g;
    const pattern = /"/g;

    // Replace the matched sections with an empty string or some placeholder
    const cleanedText = responseText?.replace(pattern, "");

    return cleanedText;
  }

  return (
    <>
      <p
        className={clsx("w-[80%] text-Base-normal")}
        dangerouslySetInnerHTML={{ __html: cleanResponseText(response) }}
      />
    </>
  );
};
