import clsx from "clsx";

export const DetailDescriptions = ({ section }) => {
  return (
    <>
      <h1 className={clsx("mt-4 mb-2 text-XL-strong text-[#000000E0]")}>
        Prevention recommendations
      </h1>
      <ol style={{ listStyleType: "decimal" }}>
        {/* No 1 */}
        <li className={clsx("list-item ml-4 text-LG-strong text-[#000000E0]")}>
          Immediate credential change
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Reset password
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Change the password of the compromised account immediately. Use a
            strong and unique password, consisting of a combination of
            uppercase, lowercase letters, numbers, and symbols.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Alternative email
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Consider changing the email address used for login if possible.
          </p>
        </ul>

        {/* No 2 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          Implement Two-Factor Authentication (2FA)
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Enable 2FA
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Implement two-factor authentication to add an additional layer of
            security to the account. This will prevent unauthorized access even
            if the login credentials are known.
          </p>
        </ul>

        {/* No 3 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          Regular security audits
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Vulnerability assesment
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Conduct regular vulnerability assessments to identify and fix
            potential security holes in the system.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Log monitoring
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Enable access and activity log monitoring to detect suspicious
            activity.
          </p>
        </ul>

        {/* No 4 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          Security awareness raising
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            User training
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Provide cybersecurity training to users and staff on good security
            practices, including how to identify phishing and other
            cyberattacks.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Awereness campaigns
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Conduct periodic security awareness campaigns to remind the
            importance of keeping credentials safe.
          </p>
        </ul>

        {/* No 5 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          System updates and patches
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Regular updates
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Ensure all software, including operating systems and applications,
            are kept up-to-date with the latest security patches.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Antivirus security
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Use and update antivirus software regularly to protect your system
            from malware and other threats.
          </p>
        </ul>

        {/* No 6 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          Data encryption
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Transmission encryption
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Ensure that all data transmitted over the network is encrypted using
            secure protocols such as HTTPS.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Storage encryption
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Apply encryption to sensitive data stored, both on servers and user
            devices.
          </p>
        </ul>

        {/* No 7 */}
        <li
          className={clsx(
            "list-item ml-4 mt-4 text-LG-strong text-[#000000E0]"
          )}
        >
          Security policy review and improvement
        </li>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Access policy
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Review and update access policies to ensure that only authorized
            users can access sensitive information.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Password management
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Use good password management, including password strength
            requirements and periodic password changes.
          </p>
        </ul>
      </ol>

      <div className={clsx("mt-4 mb-2 ")}>
        <h1 className={clsx("text-XL-strong text-[#000000E0]")}>Next action</h1>
        <ul style={{ listStyleType: "disc" }} className={clsx("")}>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Incident communication
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Notify users or relevant parties of the leak and the steps taken for
            mitigation.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            Further investigation
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Conduct an in-depth investigation to identify the source of the leak
            and assess whether any other data may have been compromised.
          </p>
          <li className={clsx("ml-5 text-LG-strong text-[#000000E0] mt-2")}>
            System remediation
          </li>
          <p
            className={clsx("ml-5 text-Base-normal text-text-description mt-1")}
          >
            Implement all recommendations provided and monitor their
            implementation to ensure no vulnerabilities remain.
          </p>
        </ul>
      </div>

      <div className={clsx("mt-4 mb-2 ")}>
        <h1 className={clsx("text-XL-strong text-[#000000E0]")}>Note</h1>

        <p className={clsx("text-Base-normal text-text-description mt-1")}>
          By following these steps, it is hoped that the risk of similar data
          leaks can be minimized in the future
        </p>
      </div>
    </>
  );
};
