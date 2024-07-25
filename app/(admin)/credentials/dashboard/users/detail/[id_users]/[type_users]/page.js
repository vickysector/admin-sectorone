"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import {
  MARKETING_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";

export default function DetailRoleUsers({ params }) {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  //   End of: Functions Handler

  // Start of: API Intregations

  // End of: API Intregations

  return (
    <main>
      {/* Section Users */}
      {params.type_users === USERS_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
              >
                Deactivate accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button>
            </div>
          </div>
        </section>
      )}
      {/* Section Users */}

      {/* Section Marketing */}
      {params.type_users === MARKETING_SECTION_ROLE_SECTION && (
        <section>
          <h1>Marketing</h1>
        </section>
      )}
      {/* Section Marketing */}
    </main>
  );
}
